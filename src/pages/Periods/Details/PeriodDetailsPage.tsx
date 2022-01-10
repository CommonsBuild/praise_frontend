import BreadCrumb from "@/components/BreadCrumb";
import { SinglePeriod } from "@/model/periods";
import BackLink from "@/navigation/BackLink";
import PeriodDetails from "@/pages/Periods/Details/components/Details";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { default as React } from "react";
import "react-day-picker/lib/style.css";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import PeriodNameForm from "./components/PeriodNameForm";
import QuantifierTable from "./components/QuantifierTable";
import ReceiverTable from "./components/ReceiverTable";

const PeriodDetailHead = () => {
  let { periodId } = useParams() as any;
  const period = useRecoilValue(SinglePeriod({ periodId }));

  return (
    <>
      {" "}
      <div className="float-right px-2 py-1 text-xs text-white bg-black rounded-full">
        {period ? period.status : null}
      </div>
      <PeriodNameForm />
      <PeriodDetails />
    </>
  );
};

const PeriodDetailPage = () => {
  return (
    <>
      <BreadCrumb name="Quantification periods" icon={faCalendarAlt} />
      <BackLink />

      <div className="w-2/3 praise-box ">
        <React.Suspense fallback="Loading…">
          <PeriodDetailHead />
        </React.Suspense>
      </div>
      <div className="w-2/3 praise-box">
        <React.Suspense fallback="Loading…">
          <QuantifierTable />
        </React.Suspense>
      </div>
      <div className="w-2/3 praise-box">
        <React.Suspense fallback="Loading…">
          <ReceiverTable />
        </React.Suspense>
      </div>
    </>
  );
};

export default PeriodDetailPage;