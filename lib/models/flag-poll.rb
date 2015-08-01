require 'data_mapper'


module Themis
    module Models
        class FlagPoll
            include DataMapper::Resource

            property :id, Serial
            property :state, Enum[:unknown, :success, :error], default: :unknown, required: true
            property :created_at, DateTime, required: true
            property :updated_at, DateTime

            belongs_to :flag
        end
    end
end
