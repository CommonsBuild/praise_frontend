import ApiErrorMessage from "@/components/form/ApiErrorMessage";
import FieldErrorMessage from "@/components/form/FieldErrorMessage";
import OutsideClickHandler from "@/components/OutsideClickHandler";
import {
  SinglePeriod,
  UpdatePeriodApiResponse,
  useAllPeriodsQuery,
  useUpdatePeriod,
} from "@/model/periods";
import { DEFAULT_DATE_FORMAT, formatDate } from "@/utils/date";
import { isMatch } from "date-fns";
import { ValidationErrors } from "final-form";
import { default as React } from "react";
import "react-day-picker/lib/style.css";
import { Field, Form } from "react-final-form";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { PeriodDayPicker } from "../create/PeriodDayPicker";

const validate = (
  values: Record<string, any>
): ValidationErrors | Promise<ValidationErrors> => {
  const errors = {} as any;

  // End date validation
  if (values.endDate) {
    if (!isMatch(values.endDate, DEFAULT_DATE_FORMAT)) {
      errors.endDate = "Invalid date format";
    }
  } else {
    errors.endDate = "Required";
  }

  return errors as ValidationErrors;
};

const PeriodDateForm = () => {
    let { id } = useParams() as any;
  
    useAllPeriodsQuery(); // Make sure that all periods are fetched
    const period = useRecoilValue(SinglePeriod({ id: id }));
    const [apiResponse, setApiResponse] = useRecoilState(UpdatePeriodApiResponse);
    const { updatePeriod } = useUpdatePeriod();
  
    const inputRef = React.useRef<HTMLInputElement | null>(null);
  
    // Is only called if validate is successful
    const onSubmit = async (values: Record<string, any>) => {      
      if (!period || period === values.endDate) return; // Only save if endDate has changed
      setApiResponse(null); // Clear any old API error messages
      const newPeriod = { ...period };
      newPeriod.endDate = values.endDate;
      updatePeriod(newPeriod);      
    };
  
    if (!period) return null;    
  
    return (
      <Form
        onSubmit={onSubmit}
        validate={validate}
        mutators={{
          setDate: (args, state, utils) => {
            utils.changeValue(state, "endDate", () => args);
            onSubmit(state.formState.values);
          },
        }}
        initialValues={{ endDate: formatDate(period.endDate) }}
        render={({ handleSubmit, submitSucceeded, form }) => (
          <form onSubmit={handleSubmit} className="leading-loose">
            <div>
              <Field name="endDate">
                {({ input, meta }) => (
                  <div className="mb-2">
                    <OutsideClickHandler
                      onOutsideClick={handleSubmit}
                      active={meta.active!}
                    >
                        <input
                            type="text"
                            id="input-period-date"
                            {...input}
                            ref={inputRef}
                            autoComplete="off"
                            placeholder="e.g. 2021-01-01"
                            className="relative left-[-5px] pl-1 text-sm font-semibold bg-transparent border border-transparent hover:border-gray-300"
                        />
                        <PeriodDayPicker />
                    </OutsideClickHandler>
                    <FieldErrorMessage name="endDate" apiResponse={apiResponse} />
                  </div>
                )}
              </Field>
            </div>
            {submitSucceeded && <ApiErrorMessage apiResponse={apiResponse} />}
          </form>
        )}
      />
    );
  };

  export default PeriodDateForm;