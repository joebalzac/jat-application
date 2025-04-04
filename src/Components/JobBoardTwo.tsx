import React, { useEffect, useState } from "react";
import { Job, useJobs } from "../Hooks/useJobs";

const statuses = ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"];

const JobBoardTwo = () => {
  const { data: jobs, isLoading, error } = useJobs();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);

  useEffect(() => {
    if (jobs) {
      setAllJobs(jobs);
    }
  }, [jobs]);

  if (isLoading) {
    <div>Loading....</div>;
  }

  if (error) {
    <div>An unknown error has occurred</div>;
  }

  const groupedJobs: Record<string, Job[]> = {};

  statuses.forEach((status) => {
    groupedJobs[status] = allJobs?.filter((job) => job.status === status);
  });

  const handleSelectedJob = (job: Job) => {
    setSelectedJobs([...selectedJobs, job.id]);
  };

  const handleDeleteJob = (id: number) => {
    setAllJobs(allJobs?.filter((job) => job.id !== id));
  };

  return (
    <div className="grid grid-cols-3">
      {statuses.map((status) => {
        return (
          <div>
            <div>
              <h3>{status}</h3>
              {groupedJobs[status].map((job) => (
                <div className="flex items-center">
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <p> {job.location}</p>
                  <button onClick={() => handleSelectedJob(job)}>Select</button>
                  <button onClick={() => handleDeleteJob(job.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobBoardTwo;
