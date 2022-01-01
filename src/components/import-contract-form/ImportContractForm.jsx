import React, { useEffect, useCallback, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
// import Web3Service from "../../services/web3.service";

const ImportContractForm = ({ wallet, setContract }) => {
    const [isDisabled, setIsDisabled] = useState(false);

    const formik = useFormik({
        initialValues: {
            contractAddress: "",

        },
        validationSchema: Yup.object({
            contractAddress: Yup.string()
                .min(44, 'Minimum length of name must be 44')
                .max(44, 'Maximum length of name must be 44')
                .required('This field is required*'),

        }),
        onSubmit: values => {
            // const { deployContract } = Web3Service;
            setIsDisabled(true);
            alert(values.contractAddress);
            // values.symbol = values.symbol.toUpperCase();
            // deployContract({ ...values, ...wallet, setIsDisabled, setContract });
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
                    <Form.Group className="mb-3" style={{ width: "500px" }}>
                        <Form.Label>Contract</Form.Label>
                        <Form.Control disabled={isDisabled} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.contractAddress} type="text" name="contractAddress" id="contractAddress" placeholder="@eg: 0x000000000000000000000000000000" />

                        {formik.touched.contractAddress && formik.errors.supply ? (
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

                {"  "} { isDisabled ? "Importing" : "Import" }
            </Button>
        </Form>
    )
}

export default ImportContractForm;