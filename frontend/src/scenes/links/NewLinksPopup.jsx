import { AxiosError } from 'axios';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import Settings from '../../components/Links/Settings/Settings';
import Preview from '../../products/LinkPreview';
import {
  createHelper,
  getHelperById,
  updateHelper,
} from '../../services/helperLinkService';
import { deleteLink } from '../../services/linkService';
import { HelperLinkContext } from '../../services/linksProvider';
import GuideTemplate from '../../templates/GuideTemplate/GuideTemplate';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';
import { emitToastError } from '../../utils/guideHelper';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';
import styles from './LinkPage.module.scss';
import LinkAppearance from './LinkPageComponents/LinkAppearance';
import LinkContent from './LinkPageComponents/LinkContent';

const DEFAULT_VALUES = {
  title: '',
  headerBackgroundColor: '#F8F9F8',
  linkFontColor: '#344054',
  iconColor: '#7F56D9',
};

const NewLinksPopup = ({
  autoOpen = false,
  isEdit,
  itemId,
  setItemsUpdated,
  setIsEdit,
}) => {
  const [activeBtn, setActiveBtn] = useState(0);
  const {
    showSettings,
    helper,
    setHelper,
    links,
    deletedLinks,
    setLinks,
    setHelperToEdit,
    setDeletedLinks,
  } = useContext(HelperLinkContext);

  const { openDialog, closeDialog, isOpen } = useDialog();

  const resetHelper = (close = true) => {
    close && closeDialog();
    setHelper({});
    setLinks([]);
    setHelperToEdit(null);
    setDeletedLinks([]);
  };

  const fetchHelperData = async () => {
    try {
      const { links, ...data } = await getHelperById(itemId);
      setHelper(data);
      setLinks(links.sort((a, b) => a.order - b.order));
      setHelperToEdit(itemId);
    } catch (error) {
      emitToastError(buildToastError(error));
      resetHelper();
    }
  };

  useEffect(() => {
    if (autoOpen) {
      openDialog();
    }
  }, [autoOpen]);

  useEffect(() => {
    if (isEdit) {
      fetchHelperData();
    } else {
      setHelper(DEFAULT_VALUES);
      setLinks([]);
    }
    if (!isOpen) {
      resetHelper(false);
    }
  }, [isOpen]);

  const buildToastError = (msg) => {
    return msg.response
      ? msg
      : {
          response: { data: { errors: [{ msg }] } },
        };
  };

  const handleLinks = async (item) => {
    const { id, ...link } = item;
    if (!link?.title.trim() || !link?.url.trim()) {
      emitToastError(buildToastError('Title and URL are required'));
      return null;
    }
    try {
      if (typeof id === 'number') return item;
      return { ...link };
    } catch (err) {
      emitToastError(err);
      return null;
    }
  };

  const handleSaveHelper = async () => {
    let newHelper;
    const formattedLinks = await Promise.all(links.map(handleLinks));
    try {
      if (formattedLinks.some((it) => !it)) {
        return null;
      }
      newHelper = await (isEdit
        ? updateHelper(helper, formattedLinks)
        : createHelper(helper, formattedLinks));
      setHelper(newHelper);
      setItemsUpdated((prevState) => !prevState);
    } catch (err) {
      let msg;
      if (err instanceof AxiosError) {
        msg = err.response.data.errors[0];
      } else {
        msg = err;
      }
      emitToastError(buildToastError(msg));
      return null;
    }
    if (isEdit && deletedLinks.length) {
      await Promise.all(
        deletedLinks.map(async (it) => {
          try {
            return await deleteLink(it.id);
          } catch (err) {
            emitToastError(err);
            return null;
          }
        })
      );
    }
    if (newHelper) {
      const toastMessage = isEdit
        ? 'You edited this Helper Link'
        : 'New Helper Link saved';
      toastEmitter.emit(TOAST_EMITTER_KEY, toastMessage);
      resetHelper();
    }
  };

  const rightContent = () => <Preview />;
  const leftContent = () => (
    <>
      {showSettings && <Settings />}
      <LinkContent />
    </>
  );
  const leftAppearance = () => (
    <LinkAppearance handleSaveHelper={handleSaveHelper} />
  );

  return (
    <div className={styles.new__container}>
      <GuideTemplate
        title={isEdit ? 'Edit Helper Link' : 'New Helper Link'}
        activeButton={activeBtn}
        handleButtonClick={setActiveBtn}
        rightContent={rightContent}
        leftContent={leftContent}
        leftAppearance={leftAppearance}
        onSave={handleSaveHelper}
        setIsEdit={setIsEdit}
      />
    </div>
  );
};

NewLinksPopup.propTypes = {
  autoOpen: PropTypes.bool,
  isEdit: PropTypes.bool.isRequired,
  itemId: PropTypes.number,
  setIsEdit: PropTypes.func,
  setItemsUpdated: PropTypes.func.isRequired,
};

export default NewLinksPopup;
