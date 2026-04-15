import "./FullPageLoader.css";

type FullPageLoaderProps = {
  label?: string;
};

const FullPageLoader = ({ label = "Loading..." }: FullPageLoaderProps) => {
  return (
    <main className="full-page-loader" aria-live="polite" aria-busy="true">
      <div className="full-page-loader-card">
        <span className="full-page-loader-spinner" />
        <p>{label}</p>
      </div>
    </main>
  );
};

export default FullPageLoader;
