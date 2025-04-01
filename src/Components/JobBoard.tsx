import { useEffect, useState } from "react";
import { Job, useJobs } from "../Hooks/useJobs";

const statuses = ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"];

const JobBoard = () => {
  const { data: jobs, isLoading, error } = useJobs();

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job[]>([]);
  const [newJob, addNewJob] = useState({});
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newStatus, setStatus] = useState("");
  const [newAppliedDate, setAppliedDate] = useState("");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    if (jobs) {
      setAllJobs(jobs);
    }
  }, [jobs]);

  if (isLoading) {
    <div>Loading.....</div>;
  }

  if (error) {
    <div>An unknown error has occured</div>;
  }

  const groupedJobs: Record<string, Job[]> = {};

  statuses.forEach((status) => {
    groupedJobs[status] = allJobs?.filter((job) => job.status === status) || [];
  });

  const handleAddNewJob = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newJob) {
      const newJobItem: Job = {
        id: Date.now(),
        company: newCompany.trim(),
        title: newTitle.trim(),
        location: newLocation.trim(),
        status: "Wishlist",
        appliedDate: "03/31/25",
        notes: "",
      };
      setAllJobs([...allJobs, newJobItem]);
      setNewTitle("");
      setNewCompany("");
      setNewLocation("");
    }
  };

  const handleDeleteJob = (id: number) => {
    setAllJobs(allJobs.filter((job) => job.id !== id));
    setSelectedJob(selectedJob.filter((job) => job.id !== id));
  };

  const handleSelectedJob = (job: Job) => {
    setSelectedJob((prev) => {
      const prevSelected = selectedJob.some((j) => j.id === job.id);
      if (prevSelected) {
        return prev;
      } else {
        return [...prev, job];
      }
    });
  };

  return (
    <div>
      <form action="" onSubmit={handleAddNewJob}>
        <input
          className="border border-blue-500 rounded-sm"
          placeholder="Company"
          type="text"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
        />
        <input
          className="border border-blue-500 rounded-sm"
          placeholder="Job Title"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          className="border border-blue-500 rounded-sm"
          placeholder="Job Location"
          type="text"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
        />
        {/* <input
          className="border border-blue-500 rounded-sm"
          placeholder="Status"
          type="text"
          value={newStatus}
          onChange={(e) => setStatus(e.target.value)}
        /> */}
        <input
          className="border border-blue-500 rounded-sm"
          placeholder="Notes"
          type="text"
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div className="grid grid-cols-3 gap-20">
        {statuses.map((status) => {
          return (
            <div className="flex items-start flex-col gap-4">
              <h3 className="text-2xl text-amber-600">{status}</h3>
              {groupedJobs[status].map((job) => (
                <div>
                  <div className="flex">
                    <h4 className="font-semibold">{job.company}</h4>
                    {" - "}
                    <h5>{job.title}</h5>
                    <button
                      className=" ml-4 py2 px-2 border border-amber-600 text-amber-600 rounded-sm cursor-pointer"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </button>
                    <button
                      className=" ml-4 py2 px-2 border border-blue-600 text-blue-600 rounded-sm cursor-pointer disabled:border-gray-500 disabled:text-gray-500"
                      onClick={() => handleSelectedJob(job)}
                      disabled={selectedJob.some((j) => j.id === job.id)}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {selectedJob.length > 0 && (
          <div>
            {selectedJob.map((selected) => (
              <div>
                {selected.title} - {selected.company}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
