import { enqueueSnackbar } from 'notistack';

export const noti = (alert: string, type: number) => {
    switch (type) {
      case 1:
        return enqueueSnackbar(alert, {
          variant: "error",
          autoHideDuration: 5000,
        });
      case 2:
        enqueueSnackbar(alert, {
          variant: "success",
          autoHideDuration: 5000,
        });
    }
  };