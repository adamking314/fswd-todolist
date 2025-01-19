import $ from 'jquery';

$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

var getAndDisplayAllTasks = function(filter) {
  $.ajax({
    type: 'GET',
    url: 'api/tasks?api_key=1',
    dataType: 'json',
    success: function(response, textStatus) {
      $('#tasks').empty();
      response.tasks.forEach(function(task) {
        if (filter === 'active' && task.completed) return;
        if (filter === 'completed' && !task.completed) return;
        $('#tasks').append(
          '<tr>' +
            '<td>' + task.content + '</td>' +
            '<td><button class="delete btn btn-danger" data-id="' + task.id + '">Delete</button></td>' +
            '<td><input type="checkbox" class="mark-complete" data-id="' + task.id + '"' + (task.completed ? ' checked' : '') + '></td>' +
          '</tr>'
        );
      });
    },
    error: function(request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
};

var createTask = function(content) {
  $.ajax({
    type: 'POST',
    url: 'api/tasks?api_key=1',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        content: content
      }
    }),
    success: function(response, textStatus) {
      $('#new-task-content').val('');
      getAndDisplayAllTasks('active'); // Default to active tasks after creating a new task
    },
    error: function(request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
};

var deleteTask = function(id) {
  $.ajax({
    type: 'DELETE',
    url: 'api/tasks/' + id + '?api_key=1',
    success: function(response, textStatus) {
      console.log(response);
      getAndDisplayAllTasks('active'); // Default to active tasks after deleting a task
    },
    error: function(request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
};

var markTaskComplete = function(id) {
  $.ajax({
    type: 'PUT',
    url: 'api/tasks/' + id + '/mark_complete?api_key=1',
    dataType: 'json',
    success: function(response, textStatus) {
      getAndDisplayAllTasks('active'); // Default to active tasks after marking a task complete
    },
    error: function(request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
};

var markTaskActive = function(id) {
  $.ajax({
    type: 'PUT',
    url: 'api/tasks/' + id + '/mark_active?api_key=1',
    dataType: 'json',
    success: function(response, textStatus) {
      getAndDisplayAllTasks('active'); // Default to active tasks after marking a task active
    },
    error: function(request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
};

$(document).ready(function() {
  $('#create-task').on('submit', function(e) {
    e.preventDefault();
    var content = $('#new-task-content').val();
    if (content) {
      createTask(content);
    }
  });

  $(document).on('click', '.delete', function() {
    var id = $(this).data('id');
    deleteTask(id);
  });

  $(document).on('change', '.mark-complete', function() {
    var id = $(this).data('id');
    if (this.checked) {
      markTaskComplete(id);
    } else {
      markTaskActive(id);
    }
  });

  // Filter buttons logic
  $(document).on('click', '.tabs button', function() {
    var filter = $(this).text().toLowerCase();
    if (filter === 'active') {
      getAndDisplayAllTasks('active');
    } else if (filter === 'completed') {
      getAndDisplayAllTasks('completed');
    } else {
      getAndDisplayAllTasks();
    }
  });

  getAndDisplayAllTasks('active'); // Default to active tasks on page load
});
