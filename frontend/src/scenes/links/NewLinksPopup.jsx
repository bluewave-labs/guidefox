import PropTypes from 'prop-types';
import { useContext, useEffect, useState, useRef } from 'react';
import Settings from '../../components/Links/Settings/Settings';
import Preview from '../../products/LinkPreview';
import {
  createHelper,
  getHelperById,
  updateHelper,
} from '../../services/helperLinkService';
import { deleteLink } from '../../services/linkService';
import {
  DEFAULT_VALUES,
  HelperLinkContext,
} from '../../services/linksProvider';
import GuideTemplate from '../../templates/GuideTemplate/GuideTemplate';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';
import { emitToastError, onSaveTemplate } from '../../utils/guideHelper';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';
import styles from './LinkPage.module.scss';
import LinkAppearance from './LinkPageComponents/LinkAppearance';
import LinkContent from './LinkPageComponents/LinkContent';
import { newLinkSchema, appearanceSchema } from '../../utils/linkHelper';

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
  const formikRef = useRef(null);

  const resetHelper = (close = true) => {
    close && closeDialog();
    setHelper(DEFAULT_VALUES);
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
    const formattedLinks = await Promise.all(links.map(handleLinks));
    if (formattedLinks.some((it) => !it)) return;
    const appearanceKeys = [
      'title',
      'url',
      'headerBackgroundColor',
      'linkFontColor',
      'iconColor',
    ];

    const fieldPriority = [
      'title',
      'url',
      'backgroundColor',
      'fontColor',
      'borderColor',
    ];

    await onSaveTemplate({
      data: helper,
      schema: newLinkSchema.concat(appearanceSchema),
      formikRef,
      appearanceKeys,
      setActiveButton: setActiveBtn,
      fieldPriority,
      onSuccess: async () => {
        try {
          const newHelper = isEdit
            ? await updateHelper(helper, formattedLinks)
            : await createHelper(helper, formattedLinks);

          setHelper(newHelper);
          setItemsUpdated((prev) => !prev);

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

          const toastMessage = isEdit
            ? 'You edited this Helper Link'
            : 'New Helper Link saved';

          toastEmitter.emit(TOAST_EMITTER_KEY, toastMessage);
          resetHelper();
        } catch (err) {
          console.error('Error saving helper link:', err);
          emitToastError(err);
        }
      },
    });
  };

  const rightContent = () => <Preview />;
  const leftContent = () => (
    <>
      {showSettings && <Settings />}
      <LinkContent />
    </>
  );
  const leftAppearance = () => (
    <LinkAppearance ref={formikRef} handleSaveHelper={handleSaveHelper} />
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
        disableSaveButton={showSettings}
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
