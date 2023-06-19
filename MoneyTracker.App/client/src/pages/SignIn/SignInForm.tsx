import React, {useState} from 'react';
import {IUserType, UserLoginType} from '../../types/IUserType';
import '../../styles/Registration.scss';
import {AuthorizationReducer} from '../../store/Example/Reducers/AuthorizationReducer';
import {useAppDispatch, useAppSelector} from '../../hooks/useAppDispatch';
import {useForm} from "react-hook-form";
import {useNavigate} from 'react-router-dom';
import InputWrapper from "../../elements/InputWrapper";

const {SIGN_IN, SIGN_IN_SUCCESS, SIGN_IN_ERROR} = AuthorizationReducer.actions;
const SignInForm = () => {
    const {
        register,
        formState: {
            errors,
        },
        handleSubmit,

    } = useForm()

    const error = useAppSelector((state) => state.Authorization.error);
    const IsSinging = useAppSelector((state) => state.Authorization.loading);
    const dispatch = useAppDispatch();

    const SignIn = (data: any) => {
        console.log(data)
        dispatch(SIGN_IN({email: data.email, password: data.password}));
    };

    return (
        <div className="sign-up-mobile">
            {IsSinging ? <div className="loading......"/> : null}
            <h3>Login</h3>

            <form onSubmit={handleSubmit(SignIn)} className="sign-up-mobile form-container">
                <InputWrapper>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                </InputWrapper>
                {errors.email && (
                    <p className="error-message">{errors.email.message?.toString()}</p>
                )}

                <InputWrapper>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Password is required",
                        })}
                    />
                </InputWrapper>
                {errors.password && (
                    <p className="error-message">{errors.password.message?.toString()}</p>
                )}


                {errors.confirmPassword && (
                    <p className="error-message">
                        {errors.confirmPassword.message?.toString()}
                    </p>
                )}

                <button className="button">Login</button>

                <p className="login-text">
                    Don’t have an account yet? <a href={"/registration"}> Sign Up</a>
                </p>

            </form>
        </div>
    );
};

export default SignInForm;
