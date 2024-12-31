import React from 'react';
import styles from './ProgressSteps.module.scss';
import Step from './Step';

const ProgressSteps = ({ stepData, completed=0 }) => {

    let initialStates;
    if (typeof stepData === 'number') {
        initialStates = Array(stepData).fill(false);
    }
    else{
        initialStates = stepData.map(() => false);
    }
    initialStates = initialStates.map((_, index) => index < completed);

    return (
        <div className={styles.container}>
            {typeof stepData === 'number' ? (
                initialStates.map((_, index) => (
                    <Step
                        key={index}
                        currentStep={initialStates[index]}
                        prevStep={index - 1 < 0 ? true : initialStates[index - 1]}
                        index={index}
                        dataLength={stepData}
                    />
                ))
            ) : (
                stepData.map((step, index) => (
                    <Step
                        key={index}
                        title={step.title}
                        explanation={step.explanation}
                        currentStep={initialStates[index]}
                        prevStep={index - 1 < 0 ? true : initialStates[index - 1]}
                        index={index}
                        dataLength={stepData.length}
                    />
                ))
            )}
        </div>
        
    );
};

export default ProgressSteps;
