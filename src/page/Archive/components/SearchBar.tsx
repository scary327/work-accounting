import { SearchFilter } from "../../../components/SearchFilter";

export interface SearchBarProps {
  searchValue: string;
  filterValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

/**
 * SearchBar component - обёртка для Archive страницы
 * Переделегирует на переиспользуемый SearchFilter
 */
export const SearchBar = ({
  searchValue,
  filterValue,
  onSearchChange,
  onFilterChange,
}: SearchBarProps) => {
  return (
    <SearchFilter
      searchValue={searchValue}
      filterValue={filterValue}
      placeholder="Поиск по названию кейса, наставнику или стеку..."
      filterOptions={[
        { value: "all", label: "Все кейсы" },
        { value: "accepted", label: "Принятые" },
        { value: "rejected", label: "Отклонённые" },
      ]}
      onSearchChange={onSearchChange}
      onFilterChange={onFilterChange}
    />
  );
};
