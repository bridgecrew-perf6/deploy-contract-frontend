import React, { useEffect, useCallback, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "../toast/Toast.component";

const DeployContractFrorm = ({ wallet, setContract }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [fileData, setFileData] = useState(null);

    const formik = useFormik({
        initialValues: {
            bytecode: "",
        },
        validationSchema: Yup.object({
            bytecode: Yup.string()
                .required('This field is required*')
                .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed."),
        }),
        onSubmit: values => {
            console.log(values);
            if (fileData === null) return toast.info("Please upload your ABI file (.json) format.");
        },
    });

    const resetForm = useCallback(() => {
        formik.resetForm();
    }, [formik])

    const uploadAbi = (e) => {
        if (e.target.files.length === 0) return toast.info("Please enter a valid .json format file.")
        const file = e.target.files[0];
        fileReaderOnUpload(file);
    }

    const fileReaderOnUpload = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = e => {
            let { result } = e.target;
            result = JSON.parse(result);
            if (result.length === 0) return toast.error("Please enter a valid ABI file (.json) format, Current file don't have any inputs");
            result = result[0].inputs;
            setFileData(result);
        };
    }

    useEffect(() => {
        if (!isDisabled) resetForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDisabled])

    return (
        <Form onSubmit={formik.handleSubmit} autoComplete="off" className="form_v1">
            <Row>
                <Col sm={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Upload ABI (.json format)</Form.Label>
                        <Form.Control className="file-input" type="file" name="abi" id="abi" disabled={isDisabled} onChange={uploadAbi} />

                        {formik.touched.abi && formik.errors.abi ? (
                            <div className="error-formik">{formik.errors.abi}</div>
                        ) : null}
                    </Form.Group>
                </Col>
            </Row>

            {
                fileData?.map((row) => (
                    <Row>
                        <Col sm={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload ABI (.json format)</Form.Label>
                                <Form.Control className="file-input" type="file" name="abi" id="abi" disabled={isDisabled} onChange={uploadAbi} />

                                {formik.touched.abi && formik.errors.abi ? (
                                    <div className="error-formik">{formik.errors.abi}</div>
                                ) : null}
                            </Form.Group>
                        </Col>
                    </Row>

                ))
            }

            <Row>
                <Col sm={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Bytecode</Form.Label>
                        <Form.Control rows={4} disabled={isDisabled} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.bytecode} as="textarea" name="bytecode" id="bytecode" placeholder="@eg: 0x0x0x00000000000000000000000000000000000....." />

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