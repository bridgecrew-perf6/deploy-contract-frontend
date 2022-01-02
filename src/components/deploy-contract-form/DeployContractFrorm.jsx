import React, { useEffect, useCallback, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";

const DeployContractFrorm = ({ wallet, setContract }) => {
    const [isDisabled, setIsDisabled] = useState(false);

    const formik = useFormik({
        initialValues: {
            bytecode: "",
            abi: {}

        },
        validationSchema: Yup.object({
            bytecode: Yup.string()
                .required('This field is required*')
                .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed."),
        }),
        onSubmit: values => {
            setIsDisabled(true);
        },
    });

    const resetForm = useCallback(() => {
        formik.resetForm();
    }, [formik])

    useEffect(() => {
        if (!isDisabled) resetForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDisabled])

    return (
        <Form onSubmit={formik.handleSubmit} autoComplete="off" className="form_v1">
            <Row>
                <Col sm={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Upload ABI .json File</Form.Label>
                        {/* <Form.File disabled={isDisabled} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.abi} type="file" name="abi" id="abi" placeholder="@eg: .json file....." /> */}

                        {formik.touched.abi && formik.errors.abi ? (
                            <div className="error-formik">{formik.errors.abi}</div>
                        ) : null}
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col sm={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Bytecode</Form.Label>
                        <Form.Control disabled={isDisabled} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.bytecode} as="textarea" name="bytecode" id="bytecode" placeholder="@eg: 0x0x0x00000000000000000000000000000000000....." />

                        {formik.touched.bytecode && formik.errors.bytecode ? (
                            <div className="error-formik">{formik.errors.bytecode}</div>
                        ) : null}
                    </Form.Group>
                </Col>
            </Row>

            <div className="text-center">
                <Button type="submit" className="btn_submit" disabled={isDisabled}>
                    {
                        isDisabled &&
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }

                    {"  "} {isDisabled ? "Deploying" : "Deploy"}
                </Button>
            </div>
        </Form>
    )
}

export default DeployContractFrorm;