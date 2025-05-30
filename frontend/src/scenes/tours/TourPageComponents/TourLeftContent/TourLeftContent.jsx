import { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import styles from './TourLeftContent.module.scss';
import DraggableTourStep from '../../../../components/Tour/DraggableTourStep/DraggableTourStep';
import Button from '../../../../components/Button/Button';
import CustomTextField from '../../../../components/TextFieldComponents/CustomTextField/CustomTextField';
import { List } from '@mui/material';

const TourLeftContent = ({
  stepsData,
  setStepsData,
  setTourDetails,
  currentStep,
  setCurrentStep,
}) => {
  const [activeDragId, setActiveDragId] = useState(null); // Track the currently dragged item

  const defaultStep = {
    title: 'Step',
    header: 'Welcome to GuideFox',
    description:
      'Serve your users and increase product adoption with hints, popups, banners, and helper links. \n\nEarn an extra 30% if you purchase an annual plan with us.',
    targetElement: '',
  };

  const addNewStepHandler = () => {
    setStepsData((prev) => [
      ...prev,
      {
        ...defaultStep,
        id: uuidv4(),
        title: `Step ${prev.length + 1}`,
      },
    ]);
  };

  const renameStepHandler = (newName) => {
    setTourDetails('title', newName);
  };

  const selectHandler = (identity) => {
    const step = stepsData.find((step) => step.id === identity);
    if (!step) {
      console.error('Step not found');
      return;
    }
    setCurrentStep(step);
  };

  const deleteHandler = (identity) => {
    if (stepsData.length === 1) return;

    const updatedSteps = stepsData.filter(({ id }) => id !== identity);

    if (identity === currentStep.id) {
      setCurrentStep(updatedSteps[0]);
    }

    setStepsData(updatedSteps);
  };

  const handleDragStart = (id) => {
    setActiveDragId(id);
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetId) => {
    if (!activeDragId) return;

    const currentIndex = stepsData.findIndex(
      (step) => step.id === activeDragId
    );
    const targetIndex = stepsData.findIndex((step) => step.id === targetId);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const updatedTourStep = [...stepsData];
      const [draggedItem] = updatedTourStep.splice(currentIndex, 1);
      updatedTourStep.splice(targetIndex, 0, draggedItem);

      setStepsData(updatedTourStep);
    }
  };

  return (
    <div className={styles.container}>
      <CustomTextField
        value={currentStep.targetElement}
        onChange={(e) => setTourDetails('targetElement', e?.target.value)}
        labelSubText="Target element for each step"
        labelTextStyles={{ color: 'var(--main-text-color)' }}
        fullWidth
        inputHeight="40px"
        placeholder=".element"
        style={{ marginTop: '1.25rem' }}
      />

      <h2 style={{ marginTop: '2.2rem', marginBottom: '20px' }}>
        Tour steps (popups)
      </h2>

      <List className={styles.stepsList}>
        {stepsData.map(({ id, title }) => (
          <DraggableTourStep
            key={id}
            id={id}
            text={title}
            isActive={currentStep.id === id}
            stepsLength={stepsData.length}
            stepNameChangeHandler={(value) => renameStepHandler(value)}
            onSelectHandler={() => selectHandler(id)}
            onDeleteHandler={() => deleteHandler(id)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </List>

      <Button
        onClick={addNewStepHandler}
        style={{ borderRadius: '8px', marginTop: '1.5rem', width: '100%' }}
        text="Add a new step"
      />
    </div>
  );
};

const stepShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  targetElement: PropTypes.string.isRequired,
});

TourLeftContent.propTypes = {
  stepsData: PropTypes.arrayOf(stepShape).isRequired,
  currentStep: stepShape.isRequired,
  setStepsData: PropTypes.func.isRequired,
  setTourDetails: PropTypes.func.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
};

export default TourLeftContent;
