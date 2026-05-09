from __future__ import annotations

import uuid
import traceback

from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, Future
from typing import Dict, Any, Optional

from backend.orchestration.pipeline_manager import (
    PipelineManager,
)


class TaskQueue:
    """
    Lightweight asynchronous orchestration queue.

    Responsibilities:
    - background execution
    - task lifecycle tracking
    - status reporting
    - result storage
    - queue monitoring
    - cancellation support
    """

    def __init__(
        self,
        pipeline_manager: PipelineManager,
        max_workers: int = 2,
    ) -> None:

        self.pipeline_manager = pipeline_manager

        self.executor = ThreadPoolExecutor(
            max_workers=max_workers
        )

        # Public-safe task metadata
        self.tasks: Dict[str, Dict[str, Any]] = {}

        # Internal executor future tracking
        self._futures: Dict[str, Future] = {}

    def submit_task(
        self,
        input_data,
    ) -> str:

        task_id = str(uuid.uuid4())

        self.tasks[task_id] = {
            "status": "queued",
            "result": None,
            "error": None,
            "created_at": self._utc_now(),
            "started_at": None,
            "completed_at": None,
        }

        future = self.executor.submit(
            self._run_task,
            task_id,
            input_data,
        )

        self._futures[task_id] = future

        return task_id

    def _run_task(
        self,
        task_id: str,
        input_data,
    ) -> None:

        try:

            self.tasks[task_id]["status"] = "running"

            self.tasks[task_id]["started_at"] = (
                self._utc_now()
            )

            result = self.pipeline_manager.run_pipeline(
                input_data
            )

            self.tasks[task_id]["result"] = result

            self.tasks[task_id]["status"] = "completed"

            self.tasks[task_id]["completed_at"] = (
                self._utc_now()
            )

        except Exception as exc:

            self.tasks[task_id]["status"] = "failed"

            self.tasks[task_id]["completed_at"] = (
                self._utc_now()
            )

            self.tasks[task_id]["error"] = {
                "message": str(exc),
                "traceback": traceback.format_exc(),
            }

    def get_status(
        self,
        task_id: str,
    ) -> Dict[str, Any]:

        if task_id not in self.tasks:

            return {
                "status": "not_found"
            }

        task = self.tasks[task_id]

        return {
            "status": task["status"],
            "created_at": task["created_at"],
            "started_at": task["started_at"],
            "completed_at": task["completed_at"],
            "error": task["error"],
        }

    def get_result(
        self,
        task_id: str,
    ) -> Optional[Any]:

        if task_id not in self.tasks:
            return None

        return self.tasks[task_id]["result"]

    def cancel_task(
        self,
        task_id: str,
    ) -> bool:

        if task_id not in self._futures:
            return False

        future = self._futures[task_id]

        cancelled = future.cancel()

        if cancelled:

            self.tasks[task_id]["status"] = (
                "cancelled"
            )

            self.tasks[task_id]["completed_at"] = (
                self._utc_now()
            )

        return cancelled

    def cleanup_task(
        self,
        task_id: str,
    ) -> None:

        if task_id in self.tasks:
            del self.tasks[task_id]

        if task_id in self._futures:
            del self._futures[task_id]

    def cleanup_completed_tasks(
        self,
    ) -> None:

        removable = []

        for task_id, task in self.tasks.items():

            if task["status"] in [
                "completed",
                "failed",
                "cancelled",
            ]:
                removable.append(task_id)

        for task_id in removable:
            self.cleanup_task(task_id)

    def get_queue_stats(
        self,
    ) -> Dict[str, int]:

        stats = {
            "total_tasks": len(self.tasks),
            "queued": 0,
            "running": 0,
            "completed": 0,
            "failed": 0,
            "cancelled": 0,
        }

        for task in self.tasks.values():

            status = task["status"]

            if status in stats:
                stats[status] += 1

        return stats

    @staticmethod
    def _utc_now() -> str:

        return datetime.now(
            timezone.utc
        ).isoformat()