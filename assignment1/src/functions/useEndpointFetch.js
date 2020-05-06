import axios from "axios";

export const useEndpointFetch = (props) => {
  const { method, data, url } = props;

  return axios({
    method,
    url,
    data,
  });
};
