import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

export default function Scorecard() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [courseExists, setCourseExists] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const scorecardResponse = await fetch(
        `http://localhost:8080/api/scorecards/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      const scorecardJson = await scorecardResponse.json();
      const courseResponse = await fetch(
        `http://localhost:8080/api/courses/${scorecardJson.scorecard[0].course}`,
      );
      const courseJson = await courseResponse.json();
      console.log(courseJson);

      if (scorecardResponse.ok && courseResponse.ok) {
        if (scorecardJson.scorecard.length === 1) {
          setCourseExists(true);
          const scorecardDate = parseISO(scorecardJson.scorecard[0].date);
          const formattedDate = format(scorecardDate, 'MMM d, yyyy');
          const formattedTime = format(scorecardDate, 'p');
          setDate(formattedDate);
          setStartTime(formattedTime);
          setCourseName(courseJson.course.name);
          const courseCity = courseJson.course.city;
          const courseState = courseJson.course.state;
          setLocation(`${courseCity}, ${courseState}`);
        }
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {courseExists ? (
        <>
          <h1>{courseName}</h1>
          <p>
            {date} at {startTime}, {location}
          </p>
        </>
      ) : (
        <div>Scorecard does not exist</div>
      )}
    </div>
  );
}