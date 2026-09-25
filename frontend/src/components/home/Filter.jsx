import React, { useState } from "react";
import FilterModal from "./FilterModal";
import { useDispatch } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice.js";
import { getAllProperties } from "../../store/Property/property-action.js";

const Filter = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    dispatch(
      propertyAction.updateSearchParams({
        ...filters,
        page: 1,
      })
    );
    dispatch(getAllProperties());
  };

  return (
    <>
      <span
        className="material-symbols-outlined filter"
        onClick={handleShowAllPhotos}
      >
        tune
      </span>
      {isModalOpen && (
        <FilterModal
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Filter;
