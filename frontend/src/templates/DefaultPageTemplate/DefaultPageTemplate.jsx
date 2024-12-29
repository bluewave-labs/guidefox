import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ParagraphCSS from '@components/ParagraphCSS/ParagraphCSS';
import GuideMainPageTemplate from '../GuideMainPageTemplate/GuideMainPageTemplate';
import CreateActivityButton from '@components/Button/CreateActivityButton/CreateActivityButton';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';
import './DefaultPageTemplate.css'
import { useAuth } from '../../services/authProvider';
import { renderIfAuthorized } from '../../utils/generalHelper';
import { useDialog } from "../GuideTemplate/GuideTemplateContext";


const DefaultPageTemplate = ({ getItems, deleteItem, setIsEdit, setItemId, itemType, itemTypeInfo, getItemDetails, itemsUpdated }) => {
    const [items, setItems] = useState([]);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState();
    const [itemDeleted, setItemDeleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(true)
    const { userInfo } = useAuth();
    const { openDialog } = useDialog();
    
    const role = userInfo.role;

    const openEditPopupDialog = (id) => {
        setIsEdit(true);
        setItemId(id);
        openDialog();
    };

    const openNewPopupDialog = () => {
        setIsEdit(false);
        setItemId(null);
        openDialog();
    };
    const handleDelete = async () => {
        try {
            await deleteItem(itemToDelete);
            setPopupOpen(false);
            if(items.length > 1){
                setLoad(false);
            }
            setItemDeleted(prevState => !prevState);
            toastEmitter.emit(TOAST_EMITTER_KEY, `This ${itemType.slice(0, -1)} is removed`);
        } catch (error) {
            toastEmitter.emit(TOAST_EMITTER_KEY, `Failed to remove this ${itemType.slice(0, -1)}`);
        }
    };

    const handleOpenPopup = (id) => {
        setItemToDelete(id);
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
        setIsEdit(false);
        setItemId(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(load){
                    setLoading(true); 
                }
                const data = await getItems();
                setItems(data);
            } catch (error) {
                console.error(`Failed to fetch ${itemType.toLowerCase()}s:`, error);
            } finally {
                setLoading(false);
                setLoad(true);
            }
        };
        fetchData();
    }, [itemDeleted, itemsUpdated]);

    const mappedItems = useMemo(() => items.map(item => ({
        idItem: item.id,
        ...getItemDetails(item),
        onDelete: () => handleOpenPopup(item.id),
        onEdit: () => openEditPopupDialog(item.id),
    })), [items, getItemDetails, handleOpenPopup, openNewPopupDialog]);

    return (
        <>
            {loading ? (
                <div/>
            ) : (
                <div className={`fade-in`}>
                    {items.length === 0 ? (
                        <div className={'placeholder-style'}>
                            {renderIfAuthorized(role, 'admin', <ParagraphCSS />)}
                            {renderIfAuthorized(role, 'admin', <CreateActivityButton type={itemType} onClick={openNewPopupDialog} />)}
                        </div>
                    ) : (
                        <GuideMainPageTemplate
                            items={mappedItems}
                            handleDelete={handleDelete}
                            isPopupOpen={isPopupOpen}
                            handleClosePopup={handleClosePopup}
                            type={itemTypeInfo}
                            onClick={openNewPopupDialog}
                        />
                    )}
                </div>
            )}
        </>
    );
};

DefaultPageTemplate.propTypes = {
    getItems: PropTypes.func.isRequired, 
    deleteItem: PropTypes.func.isRequired, 
    setIsEdit: PropTypes.func.isRequired, 
    setItemId: PropTypes.func.isRequired, 
    itemType: PropTypes.string.isRequired, 
    itemTypeInfo: PropTypes.string.isRequired, 
    getItemDetails: PropTypes.func.isRequired, 
};

export default DefaultPageTemplate;