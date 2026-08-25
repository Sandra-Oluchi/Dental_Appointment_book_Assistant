type AppointmentSlotsProps = {
  times: string[];
  selectedTime: string;
  onSelect: (time: string) => void;
};

export default function AppointmentSlots({
  times,
  selectedTime,
  onSelect,
}: AppointmentSlotsProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      Available time
      <select
        value={selectedTime}
        onChange={(event) => onSelect(event.target.value)}
        className="h-11 rounded-md border border-slate-300 bg-slate-50 px-3 text-sm text-slate-950 outline-none focus:border-teal-700"
        required
      >
        <option value="">Choose available time</option>
        {times.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </label>
  );
}
