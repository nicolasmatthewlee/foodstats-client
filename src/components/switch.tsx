interface Props {
  onClick: Function;
  isOn: Boolean;
  onLabel: string;
  offLabel: string;
}

export const Switch = ({ onClick, isOn, onLabel, offLabel }: Props) => {
  return (
    <div className="flex items-center space-x-[10px]">
      <button id="switch" onClick={(event) => onClick(event)}>
        {isOn ? (
          <div className="w-[18px] h-[10px] rounded-full relative border-[1px] border-black">
            <div className="absolute top-[1px] left-[1.5px] w-[6px] h-[6px] rounded-full bg-black" />
          </div>
        ) : (
          <div className="w-[18px] h-[10px] rounded-full relative border-[1px] bg-black border-black">
            <div className="absolute top-[1px] right-[1.5px] w-[6px] h-[6px] rounded-full bg-white" />
          </div>
        )}
      </button>
      <label htmlFor="switch" className="text-xs">
        {isOn ? offLabel : onLabel}
      </label>
    </div>
  );
};
