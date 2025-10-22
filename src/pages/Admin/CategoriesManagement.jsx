import React from 'react';
import { useGetCategoriesQuery } from '../../api/apiSlice';
import Loader from '../../components/Loader';

const CategoriesManagement = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  if (isLoading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6 font-bold">Categories Management</h1>
      <ul className="list-disc pl-6">
        {categories.map((cat) => (
          <li key={cat.id} className="mb-2">
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesManagement;
