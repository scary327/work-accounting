import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import styles from "./SearchFilter.module.css";

export interface SearchFilterProps {
  searchValue: string;
  filterValue: string;
  placeholder?: string;
  filterOptions?: Array<{ value: string; label: string }>;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

/**
 * SearchFilter component - переиспользуемый компонент поиска и фильтрации
 * Используется на нескольких страницах
 */
export const SearchFilter = ({
  searchValue,
  filterValue,
  placeholder = "Поиск...",
  filterOptions = [
    { value: "all", label: "Все" },
    { value: "accepted", label: "Принятые" },
    { value: "rejected", label: "Отклонённые" },
  ],
  onSearchChange,
  onFilterChange,
}: SearchFilterProps) => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.wrapper}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.input}
          />
        </div>

        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className={styles.selectTrigger}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};
