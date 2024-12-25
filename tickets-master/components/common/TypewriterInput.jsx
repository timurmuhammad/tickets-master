'use client'

const TypewriterInput = ({ className = null }) => {
  return (
    <>
      <input
        placeholder={``}
        className="input-deals"
        type="text"
        pattern=".{1,60}"
      />
    </>      
  );
};

export default TypewriterInput;
                      