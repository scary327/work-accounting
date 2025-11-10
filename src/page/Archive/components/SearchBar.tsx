import styles from "./SearchBar.module.css";

export interface SearchBarProps {
  searchValue: string;
  filterValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

/**
 * SearchBar component - строка поиска и фильтрации
 */
export const SearchBar = ({
  searchValue,
  filterValue,
  onSearchChange,
  onFilterChange,
}: SearchBarProps) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        className={styles.input}
        placeholder="Поиск по названию кейса, наставнику или стеку..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className={styles.select}
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="all">Все кейсы</option>
        <option value="accepted">Принятые</option>
        <option value="rejected">Отклонённые</option>
      </select>
    </div>
  );
};
