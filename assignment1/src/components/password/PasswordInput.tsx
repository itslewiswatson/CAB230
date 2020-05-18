import {
  InputAdornment,
  OutlinedInput,
  OutlinedInputProps,
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

type PasswordInputProps = {
  password: string;
  handlePasswordChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
} & OutlinedInputProps;

export const PasswordInput = (props: PasswordInputProps) => {
  const {
    inputRef,
    placeholder,
    label,
    password,
    handlePasswordChange: onChange,
  } = props;
  const [passwordFieldHidden, setPasswordFieldHidden] = useState(true);
  const classes = useStyles();

  return (
    <OutlinedInput
      required
      inputRef={inputRef}
      label={label ?? "Password"}
      placeholder={placeholder ?? "Password"}
      type={passwordFieldHidden ? "password" : "text"}
      value={password}
      onChange={onChange}
      endAdornment={
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
      }
    />
  );
};
