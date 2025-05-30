import { React, useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import GuideTemplate from '../../templates/GuideTemplate/GuideTemplate';
import TourPreview from './TourPreview/TourPreview';
import TourLeftContent from './TourPageComponents/TourLeftContent/TourLeftContent';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import TourLeftAppearance from './TourPageComponents/TourleftAppearance/TourLeftAppearance';
import { addTour, editTour, getTourById } from '../../services/tourServices';
import { useDialog } from '../../templates/GuideTemplate/GuideTemplateContext';
import { emitToastError } from '../../utils/guideHelper';
import toastEmitter, { TOAST_EMITTER_KEY } from '../../utils/toastEmitter';
import { appearanceSchema } from '../../utils/tourHelper';

const TourPage = ({
  autoOpen = false,
  itemId,
  setItemsUpdated,
  isEdit,
  setIsEdit,
}) => {
  const { openDialog, closeDialog } = useDialog();
  const [activeButton, setActiveButton] = useState(0);
  const [stepsData, setStepsData] = useState([
    {
      id: 0,
      title: 'Step 1',
      header: 'Welcome to GuideFox',
      description:
        'Serve your users and increase product adoption with hints, popups, banners, and helper links. \n\nEarn an extra 30% if you purchase an annual plan with us.',
      targetElement: '',
    },
  ]);

  const [appearance, setAppearance] = useState({
    headerColor: '#101828',
    textColor: '#344054',
    buttonBackgroundColor: '#7F56D9',
    buttonTextColor: '#FFFFFF',
    size: 'small',
    finalButtonText: 'Complete tour',
    url: 'https://',
    active: true,
  });

  const [currentStep, setCurrentStep] = useState(stepsData[0]);
  const formikRef = useRef();

  const params = new URLSearchParams(window.location.search);
  const rawData = params.get('data');

  const fetchTourData = async () => {
    try {
      const tourData = await getTourById(itemId);

      setAppearance({
        headerColor: tourData.headerColor || '#101828',
        textColor: tourData.textColor || '#344054',
        buttonBackgroundColor: tourData.buttonBackgroundColor || '#7F56D9',
        buttonTextColor: tourData.buttonTextColor || '#FFFFFF',
        size: tourData.size?.toLowerCase() || 'small',
        finalButtonText: tourData.finalButtonText || 'Complete tour',
        url: tourData.url || 'https://',
        active: tourData.active ?? true,
      });

      const sortedSteps = [...tourData.steps].sort((a, b) => a.order - b.order);
      setStepsData(sortedSteps);
      setCurrentStep(sortedSteps[0]);
    } catch (error) {
      console.log({ error });
      emitToastError(error);
    }
  };

  const preFillValues = useCallback(() => {
    try {
      const parsedData = JSON.parse(rawData);
      const mappedSteps = parsedData.map(({ element, step }) => ({
        id: step - 1,
        title: `Step ${step}`,
        header: 'Welcome to GuideFox',
        description:
          'Serve your users and increase product adoption with hints, popups, banners, and helper links. \n\nEarn an extra 30% if you purchase an annual plan with us.',
        targetElement: element,
      }));

      setStepsData(mappedSteps);
      setCurrentStep(mappedSteps[0] || null);
      openDialog();
    } catch (error) {
      console.error('Error parsing steps data:', error);
      toastEmitter.emit(TOAST_EMITTER_KEY, 'Invalid tour data format');
    }
  }, [rawData, openDialog]);

  useEffect(() => {
    const updatedCurrentStep = stepsData.find(
      (step) => step.id === currentStep.id
    );

    //Syncing currentStep with the updated step for display purpose in preview.
    if (updatedCurrentStep) {
      setCurrentStep(updatedCurrentStep);
    }
  }, [stepsData, currentStep]);

  useEffect(() => {
    if (autoOpen && rawData) preFillValues();
    else if (autoOpen) openDialog();
  }, [autoOpen, openDialog]);

  useEffect(() => {
    if (isEdit) {
      fetchTourData();
    }
  }, [isEdit, itemId]);

  const fields = [
    { name: 'headerColor', label: 'Header Color' },
    { name: 'textColor', label: 'Text Color' },
    {
      name: 'buttonBackgroundColor',
      label: 'Button Background Color',
    },
    {
      name: 'buttonTextColor',
      label: 'Button Text Color',
    },
  ];

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  const setTourDetails = (property, data) => {
    const updatedSteps = stepsData.map((step) =>
      step.id === currentStep.id ? { ...step, [property]: data } : step
    );

    setStepsData(updatedSteps);
  };

  const onSave = async () => {
    // Validate appearance data
    try {
      await appearanceSchema.validate(appearance, { abortEarly: false });
    } catch (validationError) {
      const errors = validationError.inner.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});

      // Switch to Appearance tab
      setActiveButton(1);

      // Delay to allow component re-render
      setTimeout(() => {
        if (formikRef.current) {
          formikRef.current.setErrors(errors);
          const touched = Object.keys(errors).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {});
          formikRef.current.setTouched(touched);

          // Focus on first error field
          const firstErrorKey = Object.keys(errors)[0];

          if (firstErrorKey) {
            document.querySelector(`input[name="${firstErrorKey}"]`)?.focus();
          }
        }
      }, 0);
      return;
    }

    try {
      //Removed ID since it will be automatically generated by the backend.
      /* eslint-disable no-unused-vars */
      const finalSteps = stepsData.map(({ id, ...data }, index) => ({
        ...data,
        order: index,
      }));

      const data = { steps: finalSteps, ...appearance };

      isEdit ? await editTour(itemId, data) : await addTour(data);
      const toastMessage = isEdit ? 'You edited this tour' : 'New tour saved';

      toastEmitter.emit(TOAST_EMITTER_KEY, toastMessage);
      setItemsUpdated((prevState) => !prevState);
      closeDialog();

      if (params.get('autoOpen'))
        window.history.replaceState({}, '', window.location.pathname);
    } catch (error) {
      if (error.response?.data?.errors) {
        return error.response.data.errors.forEach((err) => {
          toastEmitter.emit(TOAST_EMITTER_KEY, `Error: ${err}`);
        });
      }
      const errorMessage = error.response?.data?.message
        ? `Error: ${error.response.data.message}`
        : 'An unexpected error occurred. Please try again.';
      toastEmitter.emit(TOAST_EMITTER_KEY, errorMessage);
    }
  };

  const previewComponent = (props) => (
    <TourPreview
      stepsData={stepsData}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      tourAppearance={appearance}
      {...props}
    />
  );

  const rightContent = () =>
    activeButton === 1 ? (
      previewComponent()
    ) : (
      <RichTextEditor
        previewComponent={previewComponent}
        header={currentStep.header}
        setHeader={(data) => setTourDetails('header', data)}
        setContent={(data) => setTourDetails('description', data)}
        content={currentStep.description}
        previewStyle={{ margin: 0 }}
        sx={{
          position: 'relative',
          minWidth: '400px',
          maxWidth: '700px',
          marginLeft: '3rem',
          marginTop: '1rem',
        }}
      />
    );

  return (
    <GuideTemplate
      title={isEdit ? 'Edit Tour' : 'New Tour'}
      activeButton={activeButton}
      handleButtonClick={handleButtonClick}
      onSave={onSave}
      setIsEdit={setIsEdit}
      headerButtons={['Content', 'Appearance & target URL']}
      enableActiveButton={true}
      onSwitchChange={(e) =>
        setAppearance((prev) => ({ ...prev, active: e.target.checked }))
      }
      switchValue={appearance.active}
      rightContent={rightContent}
      leftContent={() => (
        <TourLeftContent
          stepsData={stepsData}
          setStepsData={setStepsData}
          setTourDetails={setTourDetails}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      leftAppearance={() => (
        <TourLeftAppearance
          data={fields}
          tourPopupAppearance={appearance}
          setTourPopupAppearance={setAppearance}
          onSave={onSave}
          ref={formikRef}
        />
      )}
    />
  );
};

TourPage.propTypes = {
  autoOpen: PropTypes.bool,
  isEdit: PropTypes.bool,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setIsEdit: PropTypes.func,
  setItemsUpdated: PropTypes.func,
};

export default TourPage;
