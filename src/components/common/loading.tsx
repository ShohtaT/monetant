import { Oval } from 'react-loader-spinner';

// @see https://mhnpd.github.io/react-loader-spinner/docs/category/components/
export default function Loading() {
  return (
    <div className="w-full flex justify-center my-32">
      <Oval
        visible={true}
        height="50"
        width="50"
        color="#4fa94d"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
