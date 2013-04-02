STICKY_NOTES_KEY = "sticky_notes_notes";
STICKY_NOTES_ID = "sticky_notes_id";
StorageManager = {
  insert: function(key, val) {
    localStorage.setItem(key, val);
  },
  getObject: function(key) {
    return localStorage.getItem(key);
  },
  init: function() {

  }
}

StickyNoteManager = {
  notes: {},
  add: function(content) {
    var id = this.getNewId();
    console.log(id);
    this.notes["note" + id] = this.getJSON(id, content);
    console.log(this.notes["note" + id]);
    StickyNoteUIManager.addNote(this.notes["note" + id]);
    this.save();
  },
  remove: function(id) {
    console.log("removing"+id);
    delete this.notes["note" + id];
    StickyNoteUIManager.removeNote(id);
    this.save();
  },
  getJSON: function(id, content) {
    return {
      "id": id,
      "content": content
    };
  },
  getNewId: function() {
    return this.id++;
  },
  init: function() {
    var id = StorageManager.getObject(STICKY_NOTES_ID);
    this.id = (id == null) ? 0 : parseInt(id);
    this.retriveAllNotes();
  },
  save: function() {
    console.log(JSON.stringify(StickyNoteManager.notes));
    StorageManager.insert(STICKY_NOTES_KEY, JSON.stringify(StickyNoteManager.notes));
    StorageManager.insert(STICKY_NOTES_ID, StickyNoteManager.id);
  },
  retriveAllNotes: function() {
    var object = StorageManager.getObject(STICKY_NOTES_KEY);
    if (object) {
      this.notes = JSON.parse(object);
      console.log(this.notes);
      this.renderAllNotes();
    }
  },
  renderAllNotes: function() {
    for (var note in this.notes) {
      StickyNoteUIManager.addNote(this.notes[note]);
    }
  }

};

StickyNoteUIManager = {
  addNote: function(note) {
    this.template.tmpl(note).appendTo(this.noteHolder)
  },
  removeNote: function(id) {
    $("#stickNote" + id).hide().remove();
  },
  init: function() {
    this.noteHolder = $("#noteHolder");
    this.template = $("#sticknote");
  }
}

$(document).ready(function() {
  StickyNoteUIManager.init();
  StickyNoteManager.init();

  $(".buttonClickable").bind("mousedown", function() {
    $(this).addClass("btnClicked");
  });
  $(".buttonClickable").bind("mouseup", function() {
    $(this).removeClass("btnClicked");
  });
  $("#btnAddNote").bind("click", function() {
    var txt = $("#addnote").val();
    if (txt.trim() == "") {
      alert("Please add text first");
      $("#addnote").focus();
      return;
    }
    StickyNoteManager.add(txt);
    $("#addnote").val("");
  });
  $(".removeNote").bind("click", function() {
    if (confirm("Are you sure you want to remove this note ? ")) {
      var id =$(this).closest(".stickynote").find("#sticyNoteId").val();
      StickyNoteManager.remove(id);
    }
  });


})