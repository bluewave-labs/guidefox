import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { newHintSchema } from '../../../utils/hintHelper';
import DropdownList from '../../DropdownList/DropdownList';
import Switch from '../../Switch/Switch';
import CustomTextField from '../../TextFieldComponents/CustomTextField/CustomTextField';
import './HintLeftContent.css';

const HintLeftContent = ({ data, setState }) => {
  const handleRepetitionChange = (newRepetitionType) => {
    setState((prev) => ({ ...prev, buttonRepetition: newRepetitionType }));
  };

  const handleActionButtonText = (event) => {
    setState((prev) => ({ ...prev, actionButtonText: event.target.value }));
  };
  const handleActionButtonUrl = (event) => {
    setState((prev) => ({ ...prev, actionButtonUrl: event.target.value }));
  };
  const handleUrl = (event) => {
    setState((prev) => ({ ...prev, url: event.target.value }));
  };
  const handleActionChange = (newAction) => {
    setState((prev) => ({ ...prev, action: newAction }));
  };

  const handleTargetElement = (event) => {
    setState((prev) => ({ ...prev, targetElement: event.target.value }));
  };

  const handleTooltipPlacement = (newAction) => {
    setState((prev) => ({ ...prev, tooltipPlacement: newAction }));
  };

  const handleHintIcon = (event) => {
    setState((prev) => ({ ...prev, isHintIconVisible: event.target.checked }));
  };

  return (
    <Formik
      initialValues={data}
      validationSchema={newHintSchema}
      enableReinitialize={true}
      validateOnMount={false}
      validateOnBlur={false}
    >
      {({ errors, handleChange, handleBlur, validateField }) => (
        <Form className="left-content-container">
          <h2
            className="hint-label"
            style={{ marginBottom: '0.2rem', marginTop: '1.2rem' }}
          >
            Repetition
          </h2>
          <DropdownList
            actions={['Show only once', 'Show every visit']}
            onActionChange={(e) => {
              handleRepetitionChange(e);
              handleChange({ target: { name: 'buttonRepetition', value: e } });
            }}
            selectedActionString={data.buttonRepetition}
            name="buttonRepetition"
          />
          <h2
            className="hint-label"
            style={{ marginBottom: 0, marginTop: '1rem' }}
          >
            Url (can be relative)
          </h2>
          <CustomTextField
            TextFieldWidth="241px"
            error={!!errors.url}
            name="url"
            value={data.url}
            onChange={(e) => {
              handleUrl(e);
              handleChange({ target: { name: 'url', value: e.target.value } });
            }}
            onBlur={(e) => {
              handleBlur(e);
              validateField('url');
            }}
          />
          {errors.url && <small className="error-message">{errors.url}</small>}
          <h2 className="hint-label" style={{ marginTop: '16px' }}>
            Action
          </h2>
          <DropdownList
            actions={['No action', 'Open URL', 'Open URL in a new tab']}
            onActionChange={(e) => {
              handleActionChange(e);
              handleChange({
                target: { name: 'action', value: e },
              });
            }}
            selectedActionString={data.action.toLowerCase()}
            name="action"
          />
          <h2
            className="hint-label"
            style={{ marginBottom: 0, marginTop: '16px' }}
          >
            Action button url (can be relative)
          </h2>
          <CustomTextField
            TextFieldWidth="241px"
            value={data.actionButtonUrl}
            name="actionButtonUrl"
            error={!!errors.actionButtonUrl}
            onChange={(e) => {
              handleActionButtonUrl(e);
              handleChange({
                target: { name: 'actionButtonUrl', value: e.target.value },
              });
            }}
            onBlur={(e) => {
              handleBlur(e);
              validateField('actionButtonUrl');
            }}
          />
          {errors.actionButtonUrl && (
            <small className="error-message">{errors.actionButtonUrl}</small>
          )}
          <h2 className="hint-label" style={{ marginBottom: 0 }}>
            Action button text
          </h2>
          <CustomTextField
            TextFieldWidth="241px"
            value={data.actionButtonText}
            name="actionButtonText"
            error={!!errors.actionButtonText}
            onChange={(e) => {
              handleActionButtonText(e);
              handleChange({
                target: { name: 'actionButtonText', value: e.target.value },
              });
            }}
            onBlur={(e) => {
              handleBlur(e);
              validateField('actionButtonText');
            }}
          />
          {errors.actionButtonText && (
            <small className="error-message">{errors.actionButtonText}</small>
          )}
          <h2 className="hint-label" style={{ marginBottom: 0 }}>
            Target Element
          </h2>
          <CustomTextField
            TextFieldWidth="241px"
            value={data.targetElement}
            error={!!errors.targetElement}
            name="targetElement"
            onChange={(e) => {
              handleTargetElement(e);
              handleChange({
                target: { name: 'targetElement', value: e.target.value },
              });
            }}
            onBlur={(e) => {
              handleBlur(e);
              validateField('targetElement');
            }}
            helperText="Page element to attach tooltip to"
          />
          {errors.targetElement && (
            <small className="error-message">{errors.targetElement}</small>
          )}
          <h2 className="hint-label">Tooltip Placement</h2>
          <DropdownList
            actions={['Top', 'Right', 'Bottom', 'Left']}
            onActionChange={(e) => {
              handleTooltipPlacement(e);
              handleChange({
                target: { name: 'tooltipPlacement', value: e },
              });
            }}
            selectedActionString={data.tooltipPlacement}
            name="tooltipPlacement"
          />

          <div className="switch-style">
            <Switch
              id="switch"
              name="isHintIconVisible"
              onChange={(e) => {
                handleHintIcon(e);
                handleChange(e);
              }}
              value={data.isHintIconVisible}
            />
            <span style={{ fontSize: 'var(--font-regular)' }}>
              Enable hint icon
            </span>
          </div>
        </Form>
      )}
    </Formik>
  );
};

HintLeftContent.propTypes = {
  data: PropTypes.shape({
    buttonRepetition: PropTypes.string,
    actionButtonText: PropTypes.string,
    actionButtonUrl: PropTypes.string,
    action: PropTypes.string,
    targetElement: PropTypes.string,
    tooltipPlacement: PropTypes.string,
    url: PropTypes.string,
    isHintIconVisible: PropTypes.bool,
  }),
  setState: PropTypes.func,
  onSave: PropTypes.func,
};

export default HintLeftContent;
