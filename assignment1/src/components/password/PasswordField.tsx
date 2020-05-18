import {
  InputAdornment,
  TextField,
  TextFieldProps,
  Theme,
} from "@material-ui/core";
import { Visibility as VisibilityIcon } from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import React, { ChangeEvent, useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hideShowPasswordIcon: {
      cursor: "pointer",
      color: theme.palette.action.disabledBackground,
      "&:hover": {
        color: theme.palette.action.disabled,
      },
    },
    hideShowPasswordIconSelected: {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  })
);

type PasswordFieldProps = {
  name: string;
  password: string;
  handlePasswordChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
} & TextFieldProps;

export const PasswordField = (props: PasswordFieldProps) => {
  const {
    name: fieldName,
    inputRef,
    placeholder,
    label,
    margin,
    password,
    handlePasswordChange,
  } = props;
  const [passwordFieldHidden, setPasswordFieldHidden] = useState(true);
  const classes = useStyles();

  return (
    <TextField
      {...props}
      required
      name={fieldName}
      inputRef={inputRef}
      label={label ?? "Password"}
      placeholder={placeholder ?? "Password"}
      type={passwordFieldHidden ? "password" : "text"}
      value={password}
      onChange={handlePasswordChange}
      margin={margin}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            onClick={() => {
              setPasswordFieldHidden(!passwordFieldHidden);
            }}
            title="Toggle password visibility"
          >
            <VisibilityIcon
              className={classNames({
                [classes.hideShowPasswordIcon]: passwordFieldHidden,
                [classes.hideShowPasswordIconSelected]: !passwordFieldHidden,
              })}
              fontSize="default"
              color="disabled"
            />
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
    />
  );
};
