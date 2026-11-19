const OPTIONS = ['All', 'Pending', 'Confirmed', 'Cancelled'];

export default function Filters({ status, onStatus, search, onSearch }) {
  return (
    <div className="filters">
      <div className="tabs" role="group" aria-label="Filter by status">
        {OPTIONS.map((o) => (
          <button key={o} type="button" aria-pressed={status === o} onClick={() => onStatus(o)}>
            {o}
          </button>
        ))}
      </div>
      <input
        type="search"
        className="search"
        placeholder="Search by customer name"
        aria-label="Search by customer name"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
