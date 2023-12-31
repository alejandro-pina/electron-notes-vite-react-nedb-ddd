interface IconTrashProps {
    //Optional properties of the component, if anyPropiedades opcionales del componente, si las hubiera
}

const IconTrash: React.FC<IconTrashProps> = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M20,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H4A1,1,0,0,0,4,8H5V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V8h1a1,1,0,0,0,0-2ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10Zm7,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V8H17Z' />
        </svg>
    );
};

export default IconTrash;
