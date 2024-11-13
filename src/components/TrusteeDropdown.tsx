import React from 'react';

type Trustee = {
  _id: string;
  email: string;
  username: string;
  type: string;
};

type TrusteeDropdownProps = {
  trustees: Trustee[];
  selectedTrustees: string[];
  onTrusteeChange: (selectedTrustees: string[]) => void;
};

const TrusteeDropdown: React.FC<TrusteeDropdownProps> = ({
  trustees,
  selectedTrustees,
  onTrusteeChange,
}) => {
  const handleCheckboxChange = (id: string) => {
    const updatedSelectedTrustees = selectedTrustees.includes(id)
      ? selectedTrustees.filter((trusteeId) => trusteeId !== id)
      : [...selectedTrustees, id];

    onTrusteeChange(updatedSelectedTrustees);
  };

  return (
    <div>
      <h3 className="mt-4 font-medium">Select Trustees:</h3>
      <div className="mt-2 space-y-2">
        {trustees.map((trustee) => (
          <label key={trustee._id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={trustee._id}
              checked={selectedTrustees.includes(trustee._id)}
              onChange={() => handleCheckboxChange(trustee._id)}
              className="form-checkbox"
            />
            <span>{trustee.username || trustee.email}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TrusteeDropdown;
