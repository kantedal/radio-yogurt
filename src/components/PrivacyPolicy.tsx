import { FC } from "react";

interface Props {
  onClose: () => void;
}

const PrivacyPolicy: FC<Props> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-lg p-6 pt-2 pb-4 mt-4 shadow">
      <article className="prose mt-4">
        By submitting a new radio show to Radio Yogurt, I confirm that I have
        read and agree to the following terms:
        <ul>
          <li>
            I understand that my show will be broadcast on the Radio Yogurt
            station.
          </li>

          <li>
            I confirm that I am the creator and owner of the content of the
            show, or have obtained the necessary permissions to submit it.
          </li>

          <li>
            I confirm that the content of the show does not infringe on any
            intellectual property rights or other rights of any third party.
          </li>

          <li>I confirm that I like yogurt.</li>
        </ul>
      </article>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="text-gray-500 font-semibold text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
