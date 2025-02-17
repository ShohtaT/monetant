import { Audio } from 'react-loader-spinner';

// @see https://mhnpd.github.io/react-loader-spinner/docs/category/components/
export default function Loading () {
  return (
    <div className="w-full flex justify-center my-24">
      <Audio
        height="100"
        width="100"
        color="#4fa94d"
        ariaLabel="audio-loading"
        wrapperStyle={{}}
        wrapperClass="wrapper-class"
        visible={true}
      />
    </div>
  );
}
