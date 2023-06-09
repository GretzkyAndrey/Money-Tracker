import React, { useState } from 'react';
import { IUserType, UserLoginType } from '../../types/IUserType';
import '../../styles/Registration.scss';
import { RegistrationReducer } from '../../store/Example/Reducers/RegistrationReducer';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {useForm} from "react-hook-form";
import { useNavigate } from 'react-router';
const {REGISTRATION, REGISTRATION_SUCCESS, REGISTRATION_ERROR} = RegistrationReducer.actions;
const RegistrationForm = () => {
    const {
        register,
        formState: {
            errors,
        },
        handleSubmit,

    } = useForm()
    const error = useAppSelector((state) => state.Registration.error);
    const IsSinging = useAppSelector((state) => state.Registration.loading);
    const dispatch = useAppDispatch();

    const Registration = (data: any) => {
        console.log(data)
        dispatch(REGISTRATION({username: data.username, password: data.password}));
    };

    const navigate = useNavigate ();
    const handleClick = () => {
      navigate('/SignInForm');
    };
  return (
    <div className="registration">
    {IsSinging ? <div className="loading......"></div> : null}
    <form onSubmit={handleSubmit(Registration)}>
      <div className="mb-3 px-5 mt-2">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          placeholder={errors?.username ? "This field is required!" : "Your username"}
          {...register("username", {
            required: true,
          })}
        />
      </div>
      <div className="mb-3 px-5">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder={errors?.password ? "This field is required!" : "123456"}
          {...register("password", {
            required: true,
          })}
        />
      </div>
      <div className="px-5 mb-3 padding-bottom">
        <button type="submit" className="btn btn-secondary px-4">
Registration        </button>
      
      </div>
        <button  className="btn btn-secondary px-4" onClick={handleClick}>
        Sign In
    </button>
    </form>
  </div>
  );
};

export default RegistrationForm;
