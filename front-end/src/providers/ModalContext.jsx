import { createContext, useContext, useState } from "react";

// En JavaScript, el contexto se inicializa simplemente con 'undefined'
const ModalContext = createContext(undefined);

export const ModalProvider = ({ children }) => {
    // Inicializamos el estado 'modals' como un objeto vacío
    const [modals, setModals] = useState({});
    
    // Inicializamos 'selectedData' con null, ya no necesitamos el tipado <any>
    const [selectedData, setSelectedData] = useState(null);

    const openModal = (id, data) => {
        // 'id' y 'data' ya no necesitan anotaciones de tipo
        setModals((prev) => ({ ...prev, [id]: true }));
        if (data) setSelectedData(data);
    };

    const closeModal = (id) => {
        setModals((prev) => ({ ...prev, [id]: false }));
        setSelectedData(null);
    };

    const toggleModal = (id) =>
        setModals((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <ModalContext.Provider value={{ modals, selectedData, openModal, closeModal, toggleModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = () => {
    const context = useContext(ModalContext);
    
    if (!context) {
        throw new Error("useModalContext debe usarse dentro de un ModalProvider");
    }
    
    // El contexto es ahora el objeto { modals, selectedData, openModal, closeModal, toggleModal }
    return context;
};