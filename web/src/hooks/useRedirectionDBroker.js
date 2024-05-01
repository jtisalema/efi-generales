import CryptoJS from "crypto-js";
import { useSelector } from "react-redux";

/**
 *
 * @param dataToEncrypt   Object
 * @param encryptionKey  Secret key to encrypt
 */

const encryptData = (dataToEncrypt, encryptionKey) => {
  const encryptedParams = CryptoJS.AES.encrypt(
    dataToEncrypt,
    encryptionKey
  ).toString();

  return replaceSlash(encryptedParams);
};
const replaceSlash = (str) => {
  return str.replace(/\//g, "_");
};
function useRedirectionDBroker() {
  const user = useSelector((state) => state.user);
  const { email, usrcod, cdEjecutivoAdm} = user;
  const selectedFields = { email, usrcod, cdEjecutivoAdm};
  const secretKey = "$$vC2x1_?mK";
  const baseUrl = "https://siniestros.segurossuarez.com:6443";
  const encryptedUrlParams = encryptData(JSON.stringify(selectedFields), secretKey);
  const url = `${baseUrl}/${encryptedUrlParams}`;
  return url;
}

export default useRedirectionDBroker;
