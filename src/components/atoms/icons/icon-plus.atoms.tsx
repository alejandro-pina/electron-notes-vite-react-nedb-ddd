interface IconPlusProps {
    //Optional properties of the component, if anyPropiedades opcionales del componente, si las hubiera
  }
  
  const IconPlus: React.FC<IconPlusProps> = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"/>
      </svg>
    );
  };
  
export default IconPlus;