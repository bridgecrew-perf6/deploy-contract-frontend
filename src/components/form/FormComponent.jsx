import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
import Web3Service from "../../services/web3.service";

const FormComponent = ({ wallet, setContract }) => {
    const [isDisabled, setIsDisabled] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            symbol: "",
            supply: "1000000",

        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, 'Minimum length of name must be 2')
                .required('This field is required*')
                .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed."),
            symbol: Yup.string()
                .min(2, 'Minimum length of name must be 2')
                .required('This field is required*')
                .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed."),
            supply: Yup.string()
                .required('This field is required*'),
            // .matches(/^[0-9]*$/, "Only numbers are allowed."),

        }),
        onSubmit: values => {
            const { deployContract } = Web3Service;
            values.name = values.name.toUpperCase();
            values.symbol = values.symbol.toUpperCase();
            setIsDisabled(true);
            deployContract({ ...values, ...wallet, setIsDisabled, setContract });
        },
    });

    useEffect(() => {
        if (!isDisabled) formik.resetForm();  
    }, [isDisabled])

    return (
        <Form onSubmit={formik.handleSubmit} autoComplete="off" className="form_v1">
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control disabled={isDisabled} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.name} type="text" name="name" id="name" placeholder="@eg: USDT" />

                        {formik.touched.name && formik.errors.name ? (
                            <div className="error-formik">{formik.errors.name}</div>
                        ) : null}
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Symbol</Form.Label>
                        <Form.Control disabled={isDisabled} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.symbol} type="text" name="symbol" id="symbol" placeholder="@eg: USDT" />

                        {formik.touched.symbol && formik.errors.symbol ? (
                            <div className="error-formik">{formik.errors.name}</div>
                        ) : null}
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col sm={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Supply</Form.Label>
                        <Form.Control disabled={isDisabled} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.supply} type="text" name="supply" id="supply" placeholder="@eg: 1000000000000" />

                        {formik.touched.supply && formik.errors.supply ? (
                            <div className="error-formik">{formik.errors.name}</div>
                        ) : null}
                    </Form.Group>
                </Col>
            </Row>

            <Button type="submit" className="btn_submit" disabled={isDisabled}>
                {
                    isDisabled &&
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                }

                {"  "} Deploy
            </Button>
        </Form>
    )
}

export default FormComponent;