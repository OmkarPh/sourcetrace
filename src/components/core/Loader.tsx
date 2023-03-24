import React from 'react'

interface LoaderProps {
  width?: number,
  height?: number,
}

const DEFAULT_SIZE = 16;

const Loader = (props: LoaderProps) => {
  const { height, width } = props;
  const sizeClass = `h-${height || DEFAULT_SIZE} w-${width || DEFAULT_SIZE}`;
  
  return (
    <div className="flex items-center justify-center p-16 m-16">
      <div
        className={`inline-block ${sizeClass} animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-blue-600`}
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading ...
        </span>
      </div>
    </div>
  )
}

export default Loader