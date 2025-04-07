import { useEffect, useState } from "react";
import { Job, JobStatus, useJobs } from "../Hooks/useJobs";

const statuses = ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"];

const JobBoardTwo = () => {
  const { data: jobs, isLoading, error } = useJobs();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editJob, setEditJob] = useState("");
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    status: "Wishlist",
  });

  const filteredJobs = allJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (jobs) {
      setAllJobs(jobs);
    }
  }, [jobs]);

  console.log(jobs);

  if (isLoading) {
    <div>Loading....</div>;
  }

  if (error) {
    <div>An unknown error has occurred</div>;
  }

  const handleAddNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJobItem: Job = {
      id: Date.now(),
      company: newJob.company,
      title: newJob.title,
      status: newJob.status as JobStatus,
      location: newJob.location,
      appliedDate: new Date().toISOString(),
      notes: "",
      tags: [],
    };
    setAllJobs([...allJobs, newJobItem]);
    setNewJob({ title: "", company: "", location: "", status: "Wishlist" });
  };

  const groupedJobs: Record<string, Job[]> = {};

  statuses.forEach((status) => {
    groupedJobs[status] = filteredJobs?.filter((job) => job.status === status);
  });

  const handleSelectedJob = (job: Job) => {
    setSelectedJobs((prev) => {
      const prevSelected = selectedJobs.some((j) => j.id === job.id);
      if (prevSelected) {
        return prev;
      } else {
        return [...prev, job];
      }
    });
  };

  const handleRemoveJob = (job: Job) => {
    setSelectedJobs(selectedJobs.filter((js) => js.id !== job.id));
  };

  const handleDeleteJob = (id: number) => {
    setAllJobs(allJobs?.filter((job) => job.id !== id));
    setSelectedJobs(
      selectedJobs.filter((selectedJob) => selectedJob.id !== id)
    );
  };

  const handleEditJob = (title: string, id: number) => {
    setEditJob(title);
    setEditingJobId(id);
  };

  const handleSaveJob = () => {
    if (editingJobId !== null && editJob.trim()) {
      setAllJobs(
        (jobs || []).map((job) =>
          job.id === editingJobId ? { ...job, title: editJob } : job
        )
      );
      setEditingJobId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <input
            className="border border-blue-600 rounded-sm"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="border-pink-400 text-white bg-pink-500 rounded-sm"
            onClick={() => setSearch(searchInput)}
          >
            Search
          </button>
        </div>
        <div>
          <form action="" onSubmit={handleAddNewJob}>
            <input
              className="border border-blue-600 rounded-sm"
              type="text"
              placeholder="Title"
              value={newJob.title}
              onChange={(e) =>
                setNewJob((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <input
              className="border border-blue-600 rounded-sm"
              type="text"
              placeholder="Company"
              value={newJob.company}
              onChange={(e) =>
                setNewJob((prev) => ({ ...prev, company: e.target.value }))
              }
            />
            <input
              className="border border-blue-600 rounded-sm"
              type="text"
              placeholder="Location"
              value={newJob.location}
              onChange={(e) =>
                setNewJob((prev) => ({ ...prev, location: e.target.value }))
              }
            />
            <select name="status" id="">
              {jobs?.map((status) => (
                <div>{status.title}</div> // Assuming 'title' is a property of 'Job'
              ))}
            </select>
            <button
              className="border-yellow-400 text-white bg-yellow-400 rounded-sm"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-32">
        {statuses.map((status) => {
          return (
            <div>
              <div className="flex flex-col items-start gap-4">
                <h3 className="text-2xl text-blue-800 border-blue-900 border p-2 rounded-sm shadow">
                  {status}
                </h3>
                {groupedJobs[status].map((job) => (
                  <div>
                    {editingJobId === job.id ? (
                      <div>
                        <input
                          type="text"
                          value={editJob}
                          onChange={(e) => setEditJob(e.target.value)}
                        />
                        <button onClick={handleSaveJob}>Save Job Title</button>
                      </div>
                    ) : (
                      <div>
                        <div
                          key={job.id}
                          className="flex flex-col items-start gap-2"
                        >
                          <h3>{job.title}</h3>
                          <p>{job.company}</p>
                          <p> {job.location}</p>
                          <div className="flex items-center">
                            {job.tags.map((tag) => (
                              <div className="bg-pink-200 mx-2 p-2 rounded-sm cursor-pointer">
                                {tag}
                              </div>
                            ))}
                          </div>
                          <div>
                            <button
                              className="p-1 mx-2 cursor-pointer rounded-md text-purple-400 border-purple-400 border hover:bg-purple-600 hover:text-white"
                              onClick={() => handleSelectedJob(job)}
                            >
                              Select
                            </button>
                            <button
                              className="p-1 mx-2 cursor-pointer rounded-md text-red-400 border-red-400 border hover:bg-red-600 hover:text-white"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="p-1 mx-2 cursor-pointer rounded-md text-orange-400 border-orange-400 border hover:bg-orange-600 hover:text-white"
                              onClick={() => handleRemoveJob(job)}
                            >
                              Remove
                            </button>
                            <button
                              onClick={() => handleEditJob(job.title, job.id)}
                              className="p-1 mx-2 cursor-pointer rounded-md text-pink-400 border-pink-400 border hover:bg-pink-600 hover:text-white"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {selectedJobs ? (
          <div>
            {selectedJobs.map((selectJob) => (
              <div className="flex items-center">
                <h3>{selectJob.title}</h3>
                <div>{selectJob.company}</div>
                <p>{selectJob.location}</p>
                <button
                  className="p-1 mx-2 cursor-pointer rounded-md text-orange-400 border-orange-400 border hover:bg-orange-600 hover:text-white"
                  onClick={() => handleRemoveJob(selectJob)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>Add selected jobs here</div>
        )}
      </div>
    </div>
  );
};

export default JobBoardTwo;
