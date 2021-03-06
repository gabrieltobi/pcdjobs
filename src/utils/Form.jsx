import React, { Component } from 'react'

export function Form(WrappedComponent, fields, defaultValues = {}) {
  return class extends React.Component {
    state = {
      fields: {},
      values: {}
    }

    componentWillMount() {
      let stateFields = {}
      let stateValues = {}

      fields.forEach(field => {
        const fieldProps = {
          onChange: this.handleInputChange,
          id: field,
          name: field,
          invalidFeedback: null,
          value: defaultValues[field] || ''
        }

        stateFields = {
          ...stateFields,
          [field]: fieldProps
        }

        Object.defineProperty(stateValues, field, {
          get: () => this.state.fields[field].value,
          enumerable: true,
          configurable: true
        })
      })

      this.setState({
        fields: stateFields,
        values: stateValues
      })
    }

    handleInputChange = (event) => {
      const target = event.target
      const name = target.name

      let value = ''
      if (target.multiple) {
        value = [...target.options].filter(o => o.selected).map(o => o.value)
      } else {
        value = ((target.type === 'checkbox') ? target.checked : target.value)
      }

      this.setValueToField(name, value)
    }

    setInvalidFeedback = (field, invalidFeedback) => {
      this.setState({
        fields: {
          ...this.state.fields,
          [field]: {
            ...this.state.fields[field],
            invalidFeedback
          }
        }
      })
    }

    setValueToField = (field, value) => {
      this.setState({
        fields: {
          ...this.state.fields,
          [field]: {
            ...this.state.fields[field],
            value: value
          }
        },
        values: {
          ...this.state.values,
          [field]: value
        }
      })
    }

    setValues = (values) => {
      Object.keys(values || {}).forEach(valueKey => {
        this.setValueToField(valueKey, values[valueKey])
      })
    }

    render() {
      return (
        <WrappedComponent
          fields={this.state.fields}
          values={this.state.values}
          setInvalidFeedback={this.setInvalidFeedback}
          setValueToField={this.setValueToField}
          setValues={this.setValues}
          {...this.props}
        />
      )
    }
  }
}