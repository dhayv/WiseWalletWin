        <Modal 
            show={showModal} 
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
              <Modal.Header closeButton={handleClose}>
                <Modal.Title id="contained-modal-title-vcenter">Add Expense</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form className='expense-form'>
        <div className='row'>
          <div className='field'>
            <label htmlFor='expense-name'>Name</label>
            <input
              required
              type='text'
              className='input mb-5'
              id='expense-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='field'>
            <label htmlFor='expense-amount'>Amount</label>
            <input
              required
              type='number'
              className='input mb-5'
              id='expense-amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className='field'>
            <label htmlFor='expense-due-date'>Due Date</label>
            <input
              type='number'
              className='input mb-5'
              id='expense-due-date'
              placeholder='Due Day (1-31)'
              min='1'
              max='31'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className='col-sm'>
            <button type='submit' className='button is-primary is-fullwidth mt-4'>
              Add
            </button>
          </div>
        </div>
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button className='button is-success' type='submit' onClick={handleSubmit}>
                    Add
                </Button>
              </Modal.Footer>
            </Modal>