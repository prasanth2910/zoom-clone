"use client";
import { useState } from "react";
import { X, Calendar, Clock, AlignLeft, Type } from "lucide-react";
import { api } from "@/lib/api";
import type { Meeting } from "@/types/meeting";

interface Props {
  onClose: () => void;
  onScheduled: (meeting: Meeting) => void;
}

export default function ScheduleMeetingForm({ onClose, onScheduled }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) { setError("Meeting topic is required."); return; }
    if (!date) { setError("Date is required."); return; }
    if (!time) { setError("Time is required."); return; }

    const scheduled_at = new Date(`${date}T${time}`).toISOString();
    if (new Date(scheduled_at) <= new Date()) {
      setError("Scheduled time must be in the future.");
      return;
    }

    setLoading(true);
    try {
      const meeting = await api.scheduleMeeting({
        title: title.trim(),
        description: description.trim() || undefined,
        scheduled_at,
        duration_minutes: duration,
      });
      onScheduled(meeting);
    } catch (err: any) {
      setError(err.message ?? "Failed to schedule meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Schedule a Meeting</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          {/* Topic */}
          <div>
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
              <Type size={12} />
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting topic"
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
              <AlignLeft size={12} />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent resize-none"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                <Calendar size={12} />
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                min={todayStr}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                <Clock size={12} />
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
              <Clock size={12} />
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent bg-white"
            >
              {[15, 30, 45, 60, 90, 120].map((d) => (
                <option key={d} value={d}>
                  {d} minutes
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0B5CFF] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Scheduling…" : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
