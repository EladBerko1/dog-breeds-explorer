interface SearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  onlyWithSubBreeds: boolean
  onOnlyWithSubBreedsChange: (value: boolean) => void
}

// שדה חיפוש וצ'קבוקס. הרכיב לא מחזיק state משלו: הערכים מגיעים מההורה ב-props,
// וכל שינוי מדווח להורה דרך פונקציה (controlled inputs).
function SearchBar({ query, onQueryChange, onlyWithSubBreeds, onOnlyWithSubBreedsChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search breeds…"
        aria-label="Search breeds"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={onlyWithSubBreeds}
          onChange={(event) => onOnlyWithSubBreedsChange(event.target.checked)}
        />
        Only breeds with sub-breeds
      </label>
    </div>
  )
}

export default SearchBar
