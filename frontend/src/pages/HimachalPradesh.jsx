import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { fields, LOCAL_STORAGE_KEY } from '../constants';
import { getDetailsApi } from '../utils/api';

const HimachalPradesh = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  const state = 'himachalPradesh';
  const history = useHistory();

  // all input fields
  const [payLoad, setPayLoad] = useState({
    vehicleNo: '',
    chassisNo: '',
    mobileNo: '',
    vehiclePermitType: '',
    seatingCapacityExcludingDriver: '',
    borderBarrier: '',
    mvTax: '',
    ownerName: '',
    fromState: '',
    vehicleClass: '',
    taxMode: '',
    taxFromDate: '',
    taxUptoDate: '',
    serviceType: '',
    userCharge: '',
    grossVehicleWeight: '',
    unladenWeight: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const form = useRef(null);

  const getDetailsHandler = async () => {
    if (!payLoad.vehicleNo) {
      alert('Please enter vehicle no.');
      return;
    }
    setIsLoading(true);
    const { data } = await getDetailsApi({
      vehicleNo: payLoad.vehicleNo,
    });
    setIsLoading(false);
    if (data && data.success) {
      const preLoadedData = {};
      ['chassisNo', 'mobileNo', 'ownerName', 'borderBarrier'].forEach((key) => {
        if (data.detail[key]) {
          preLoadedData[key] = data.detail[key];
        }
      });
      setPayLoad((e) => ({
        ...e,
        ...preLoadedData,
        totalAmount: +payLoad.mvTax + +payLoad.userCharge,
      }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!payLoad.unladenWeight) {
      payLoad.unladenWeight = 0;
    }
    history.push('/select-payment', {
      formData: {
        ...payLoad,
        state,
        totalAmount: +payLoad.mvTax + +payLoad.userCharge,
      },
    });
  };

  const onChangeHandler = (e) => {
    setPayLoad((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  const onResetHandler = () => {
    let x = { ...payLoad };
    let p = {};
    Object.keys(x).forEach((e) => {
      p[e] = '';
    });
    setPayLoad({ ...p });
  };

  if (!isLoggedIn.accessState.includes(fields.stateName.hp)) {
    return (
      <>
        <Header />
        <div className='container text-center mt-4 '>
          <h3>No Access of this state</h3>
        </div>
      </>
    );
  }
  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>HIMACHAL PRADESH</span>
        </p>
        <p className='login-note mt-2 mb-4'>
          <b>
            Note* : The composite rated have been revised w.e.f Jan 2019. Please
            pay as per the new rates who have paid monthly
          </b>
        </p>
      </div>
      <div className='box box--main'>
        <div className='box__heading--blue'>Tax Payment Details</div>
        <form
          ref={form}
          onSubmit={onSubmitHandler}
          className='service-type tax-details mt-4'
        >
          <div className='row'>
            <div className='col-6'>
              {/* <!-- vehicle number --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='vehicleNo'
                >
                  Vehicle <sup>*</sup>
                </label>
                <input
                  tabIndex='1'
                  required
                  maxLength='10'
                  autoFocus
                  inputMode='text'
                  disabled={isLoading}
                  value={payLoad.vehicleNo}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='text'
                  id='vehicleNo'
                  name='vehicleNo'
                />
              </div>
              {/* <!-- chassis number --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='chassisNo'
                >
                  Chassis No.<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='2'
                  maxLength='19'
                  inputMode='text'
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  value={payLoad.chassisNo}
                  className='form__input w-100'
                  type='text'
                  id='chassisNo'
                  name='chassisNo'
                />
              </div>
              {/* <!-- mobile number --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='mobileNo'
                >
                  Mobile No.<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='3'
                  disabled={isLoading}
                  value={payLoad.mobileNo}
                  onChange={onChangeHandler}
                  placeholder='SMS about payment will be sent to this number '
                  className='form__input w-100'
                  type='text'
                  id='mobileNo'
                  inputMode='tel'
                  maxLength='10'
                  minLength='10'
                  name='mobileNo'
                />
              </div>
              {/* <!-- vehicle type --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='vehiclePermitType'
                >
                  Vehicle Type<sup>*</sup>
                </label>
                <select
                  tabIndex='4'
                  value={payLoad.vehiclePermitType}
                  onChange={onChangeHandler}
                  required
                  name='vehiclePermitType'
                  id='vehiclePermitType'
                >
                  <option value=''>--Select Vehicle Type--</option>
                  {fields.himachalPradesh.vehiclePermitType.map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              {payLoad.vehiclePermitType !== 'GOODS VEHICLE' ? (
                <>
                  {/* <!-- seating capacity --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='seatingCapacityExcludingDriver'
                    >
                      Seating Cap(Ex. Driver)<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='5'
                      min='0'
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      className='form__input w-100'
                      type='number'
                      value={payLoad.seatingCapacityExcludingDriver}
                      id='seatingCapacityExcludingDriver'
                      name='seatingCapacityExcludingDriver'
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* <!-- gross vehicle wieght --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='grossVehicleWeight'
                    >
                      Gross Vehicle Wt.(in kg)<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='5'
                      min='0'
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      className='form__input w-100'
                      type='number'
                      value={payLoad.grossVehicleWeight}
                      id='grossVehicleWeight'
                      name='grossVehicleWeight'
                    />
                  </div>
                  {/* <!-- unladen Weight --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='unladenWeight'
                    >
                      Unladen Wt.(in kg)<sup>*</sup>
                    </label>
                    <input
                      tabIndex='5'
                      required
                      inputMode='numeric'
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      className='form__input w-100'
                      type='number'
                      min='0'
                      value={payLoad.unladenWeight}
                      id='unladenWeight'
                      name='unladenWeight'
                    />
                  </div>
                </>
              )}

              {/* <!-- Barrier Name --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='borderBarrier'
                >
                  Barrier Name<sup>*</sup>
                </label>
                <select
                  tabIndex='6'
                  required
                  disabled={isLoading}
                  value={payLoad.borderBarrier}
                  onChange={onChangeHandler}
                  name='borderBarrier'
                  id='borderBarrier'
                >
                  <option value=''>--Select Barrier--</option>
                  {fields.himachalPradesh.borderBarrier.map((dist) => {
                    return (
                      <option key={dist.name} value={dist.name}>
                        {dist.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {/* =========================== right side fields ============================ */}
            <div className='col-6'>
              <div className='form__control text-left'>
                <label className='form__label d-block w-100 text-left'>
                  &nbsp;
                </label>
                {isLoading && <Loader className='loader__get-details' />}
                {!isLoading && (
                  <button
                    disabled={isLoading}
                    type='button'
                    onClick={getDetailsHandler}
                    className='box__button get-details'
                  >
                    <span className='glyphicon glyphicon-arrow-down mr-3'></span>
                    Get Details
                  </button>
                )}
              </div>
              {/* <!-- owner name --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='ownerName'
                >
                  Owner Name<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='7'
                  disabled={isLoading}
                  className='form__input w-100'
                  type='text'
                  id='ownerName'
                  inputMode='text'
                  name='ownerName'
                  onChange={onChangeHandler}
                  value={payLoad.ownerName}
                />
              </div>
              {/* <!-- from state --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='fromState'
                >
                  From State<sup>*</sup>
                </label>
                <select
                  tabIndex='8'
                  disabled={isLoading}
                  required
                  value={payLoad.fromState}
                  onChange={onChangeHandler}
                  name='fromState'
                  id='fromState'
                >
                  <option value=''>--Select State--</option>
                  {fields.fromState.map((type) => {
                    return (
                      <option key={type.name} value={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className='row'>
                <div className='col-sm-6'>
                  {/* <!-- vehicle class --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='vehicleClass'
                    >
                      Vehicle Class<sup>*</sup>
                    </label>
                    <select
                      tabIndex='9'
                      disabled={isLoading}
                      required
                      value={payLoad.vehicleClass}
                      onChange={onChangeHandler}
                      name='vehicleClass'
                      id='vehicleClass'
                    >
                      <option value=''>--Select Vehicle Class--</option>
                      {payLoad.vehiclePermitType ===
                        'CONTRACT CARRIAGE/PASSANGER VEHICLES' && (
                        <>
                          <option value='MOTOR CAB'>MOTOR CAB</option>
                          <option value='MAXI CAB'>MAXI CAB</option>
                          <option value='BUS'>BUS</option>
                        </>
                      )}
                      {payLoad.vehiclePermitType === 'GOODS VEHICLE' && (
                        <>
                          <option value='LIGHT GOODS VEHICLE'>
                            LIGHT GOODS VEHICLE
                          </option>
                          <option value='MEDIUM GOODS VEHICLE'>
                            MEDIUM GOODS VEHICLE
                          </option>
                          <option value='HEAVY GOODS VEHICLE'>
                            HEAVY GOODS VEHICLE
                          </option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div className='col-sm-6'>
                  {/* <!-- Service type --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='fromState'
                    >
                      Service Type<sup>*</sup>
                    </label>
                    <select
                      tabIndex='10'
                      disabled={isLoading}
                      required
                      value={payLoad.serviceType}
                      onChange={onChangeHandler}
                      name='serviceType'
                      id='serviceType'
                    >
                      <option value=''>--Select Service Type--</option>

                      {fields.himachalPradesh.serviceType.map((type) => {
                        return (
                          <option key={type.name} value={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='taxMode'
                >
                  Tax Mode<sup>*</sup>
                </label>
                <select
                  tabIndex='11'
                  required
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  value={payLoad.taxMode}
                  name='taxMode'
                  id='taxMode'
                >
                  <option value=''>--Select Tax Mode--</option>
                  {fields.taxMode.map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='row'>
                <div className='col-sm-6'>
                  {/* <!-- Tax From Date --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxFromDate'
                    >
                      Tax From<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='12'
                      disabled={isLoading}
                      className='form__input w-100'
                      type='datetime-local'
                      id='taxFromDate'
                      name='taxFromDate'
                      onChange={onChangeHandler}
                      value={payLoad.taxFromDate}
                    />
                  </div>
                </div>
                <div className='col-sm-6'>
                  {/* <!-- Tax upto Date --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxUptoDate'
                    >
                      Tax Upto<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='13'
                      disabled={isLoading}
                      className='form__input w-100'
                      id='taxUptoDate'
                      name='taxUptoDate'
                      type='datetime-local'
                      value={payLoad.taxUptoDate}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* =============== table ======================== */}
          <div className='row mt-3'>
            <div className='col-12'>
              <table className='hr-table'>
                <thead>
                  <tr>
                    <th className='hr-table-1'>SI. No.</th>
                    <th className='hr-table-2'>Particulars</th>
                    <th>Tax From</th>
                    <th>Tax Upto</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='hr-table-body' colSpan='5'>
                      No records found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-sm-3'>
              {/* <!-- Total amount --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='mvTax'
                >
                  Tax Amount<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='14'
                  min='0'
                  disabled={isLoading}
                  value={payLoad.mvTax}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='number'
                  id='mvTax'
                  name='mvTax'
                />
              </div>
            </div>
            <div className='col-sm-3'>
              {/* <!-- Service/User Charge --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='userCharge'
                >
                  Service/User Charge<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='15'
                  min='0'
                  disabled={isLoading}
                  value={payLoad.userCharge}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='number'
                  id='userCharge'
                  name='userCharge'
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <label className='form__label d-block w-100 text-left'>
                &nbsp;
              </label>
              <ActionButtons isDisabled={isLoading} onReset={onResetHandler} />
            </div>
          </div>
        </form>
        <br />
      </div>
      <marquee
        behavior='alternate'
        scrollamount='7'
        width='100%'
        direction='left'
      >
        <p className='login-note'>
          <b>
            NOTE : Incorrect mentioning of vehicle class or seating capacity may
            lead to tax evasion and defaulter shall be liable for penal action
          </b>
        </p>
      </marquee>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default HimachalPradesh;
