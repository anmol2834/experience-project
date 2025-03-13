
import React from 'react'
import './category.css'
import CategoryCard from './category card/CategoryCard'

function Category() {
  return (
    <div className='category-contain'>
      <h1>Categories : </h1>
      <div className="categories">
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
      </div>
    </div>
  )
}

export default Category

