const moment = require('moment');
const data = require('./mock_data/PunchLogicTest.json')

// Get Job Data
const jobMeta = data.jobMeta;

const getWageAndBenefitRate = job => {
  const findJob = jobMeta.find(site => site.job === job)
  return findJob
}

const getShiftHours = ({job, start, end}) => {
  const startTime = moment(start);
  const endTime = moment(end);
  const duration = moment.duration(endTime.diff(startTime));
  const hours = {jobCalc: getWageAndBenefitRate(job), work_duration: duration.asHours()};
  return hours;
}

const getWorkWithMultiplier = (work_duration, timeLog, rate) => {
  let result = 0;
  const {overtotal, doubleTotal} = timeLog

  //overtime calcuator
  if(overtotal > 0 && doubleTotal == 0){
    const calcOt = work_duration - overtotal
    result = (calcOt + (overtotal * 1.5)) * rate
  }

  // //doubletime calculator
  if(doubleTotal > 0){
    const calcDt = work_duration - doubleTotal
    result = ((calcDt * 1.5) + (doubleTotal * 2)) * rate
  }

  return result
}

// Get Employee Data
const employeeData = data.employeeData;

//Sump up the time
const sumUpPayroll = (employeeData) => {
  const dataSheet = [];

  employeeData.map(employee => {
    const timeLog = {
      employee: employee.employee,
      currentTotal: 0,
      regularTotal: 0,
      overtotal: 0,
      doubleTotal: 0,
      wageTotal: 0,
      benefitTotal: 0
    }
    
    const regularMax = Math.max(0, 40 - timeLog.currentTotal);
    const overTimeMax = Math.max(0, 48 - timeLog.currentTotal - regularMax);

    employee.timePunch.map(punch => {
      const time = getShiftHours(punch, timeLog)
      const {rate, benefitsRate} = time.jobCalc; 
      const {work_duration} = time; 

      timeLog.currentTotal += work_duration;
      timeLog.benefitTotal += (benefitsRate * work_duration)

      if (timeLog.currentTotal <= regularMax) {
        timeLog.regularTotal = timeLog.currentTotal;
        timeLog.wageTotal += (rate * work_duration)
      } else if (timeLog.currentTotal <= regularMax + overTimeMax) {
        timeLog.regularTotal = regularMax;
        timeLog.overtotal = timeLog.currentTotal - regularMax;
        timeLog.wageTotal += getWorkWithMultiplier(work_duration, timeLog, rate)
      } else {
        timeLog.overtotal = overTimeMax;
        timeLog.doubleTotal = timeLog.currentTotal - regularMax - overTimeMax;
        timeLog.wageTotal += getWorkWithMultiplier(work_duration, timeLog, rate)
      }
    })
    const data = {
      [timeLog.employee]: {
        emlployee: timeLog.employee,
        regular: timeLog.regularTotal.toFixed(4),
        overtime: timeLog.overtotal.toFixed(4),
        doubletime: timeLog.doubleTotal.toFixed(4),
        wageTotal: timeLog.wageTotal.toFixed(4),
        benefitTotal: timeLog.benefitTotal.toFixed(4)
      }
    }
    dataSheet.push(data)
  })
  console.log(JSON.stringify(dataSheet, null, 2))
}

sumUpPayroll(employeeData)
